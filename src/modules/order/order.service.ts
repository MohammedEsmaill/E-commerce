import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CartRepositoryService,
  CouponRepositoryService,
  OrderRepositoryService,
  ProductRepositoryService,
  UserRepositoryService,
} from 'src/DB/Repository';
import { createOrderDto } from './dto/createOrder.dto';
import { UserDocument } from 'src/DB/models';
import { orderStatusTypes } from 'src/common/Types/types';
import { paymentMethodTypes } from 'src/common/Types/types';
import { Decrypt } from 'src/common/security';
import { Types } from 'mongoose';
import { StripeService } from './service/stripe';
@Injectable()
export class OrderService {
  constructor(
    private CRS: CartRepositoryService,
    private ORS: OrderRepositoryService,
    private PMS: StripeService,
    private CouponRS: CouponRepositoryService,
    private PRS: ProductRepositoryService,
  ) {}
  // ---------------------------------- create order ----------------------------------
  async createOrder(body: createOrderDto, user: UserDocument) {
    const { address, paymentMethod, coupon } = body;
    const cart = await this.CRS.findOne({ filter: { userId: user._id } });
    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    if (!coupon) {
      const order = await this.ORS.create({
        userId: user._id,
        cartId: cart._id,
        totalPrice: cart.subTotal,
        phone: Decrypt(user.phone),
        address,
        paymentMethod,
        orderStatus:
          paymentMethod == paymentMethodTypes.cash
            ? orderStatusTypes.placed
            : orderStatusTypes.pending,
      });
      // update product stock
      cart.products.map(
        async (p) =>{
            const z = await this.PRS.findOneAndUpdate(
            { _id: p.product },
            { $inc: { stock: -p.quantity } },
          )
      });
      // clear cart
      cart.products = [];
      await cart.save();
      return { order };
    }
    // check if coupon exist
    const couponExist = await this.CouponRS.findOne({
      filter: { code: { $regex: coupon, $options: 'i' } },
    });
    if (!couponExist) {
      throw new BadRequestException('Coupon not exist');
    }
    if (couponExist['usedBy'].includes(user._id)) {
      throw new BadRequestException('Coupon is valid for one-time use');
    }
    if (couponExist['expireAt'] < new Date()) {
      throw new BadRequestException('Coupon is expired');
    }
    // create order

    // payCash
    if (coupon && paymentMethod == paymentMethodTypes.cash) {
      await this.CouponRS.findOneAndUpdate(
        { code: { $regex: coupon, $options: 'i' } },
        { $addToSet: { usedBy: user._id } },
      );
      const order = await this.ORS.create({
        userId: user._id,
        cartId: cart._id,
        totalPrice:
          cart.subTotal - cart.subTotal * (couponExist.discount / 100),
        phone: Decrypt(user.phone),
        address,
        paymentMethod,
        orderStatus: orderStatusTypes.placed,
        coupon: couponExist._id,
      });
      // update product stock
      cart.products.map(
        async (p) =>{
            const z = await this.PRS.findOneAndUpdate(
            { _id: p.product },
            { $inc: { stock: -p.quantity } },
          )
      });
      // clear cart
      cart.products = [];
      await cart.save();
      return { order };
    }
    // pay online
    const order = await this.ORS.create({
      userId: user._id,
      cartId: cart._id,
      totalPrice: cart.subTotal,
      phone: Decrypt(user.phone),
      address,
      paymentMethod,
      orderStatus: orderStatusTypes.pending,
      coupon: couponExist._id,
    });
    // update product stock
    cart.products.map(
      async (p) =>{
        await this.PRS.findOneAndUpdate(
          { _id: p.product },
          { $inc: { stock: -p.quantity } },
        )
    });
    return { order };
  }

  // ---------------------------------- create payment ----------------------------------
  async createPaymentStripe(orderId: Types.ObjectId, user: UserDocument) {
    try {
      // check order
      const order = await this.ORS.findOne({
        filter: {
          _id: orderId,
          userId: user._id,
          orderStatus: orderStatusTypes.pending,
        },
        populate: [
          { path: 'cartId', populate: [{ path: 'products.product' }] },
          { path: 'coupon' },
        ],
      });
      if (!order) {
        throw new BadRequestException('Order not exist');
      }
      let discount: { coupon }[] = [];
      // check coupon and apply
      if (order.coupon) {
        const applyCoupon = await this.CouponRS.findOneAndUpdate(
          { _id: order.coupon },
          { $addToSet: { usedBy: user._id } },
        );
        if (!applyCoupon || applyCoupon['startAt'] > new Date()) {
          throw new BadRequestException('Coupon not exist');
        }
        if (applyCoupon['expireAt'] < new Date()) {
          throw new BadRequestException('Coupon is expired');
        }
        if (applyCoupon['usedBy'].includes(user._id)) {
          throw new BadRequestException('Coupon is valid for one-time use');
        }
        // apply discount
        if (applyCoupon) {
          const precent = Number(order.coupon['discount']);
          const coupon = await this.PMS.createCoupon(precent);
          discount = [{ coupon: coupon.id }];
        }
      }
      // create payment
      const session = await this.PMS.createPaymentCheckoutSession({
        customer_email: user.email,
        metadata: { orderId: order._id.toString() },
        line_items: order.cartId['products'].map((product) => ({
          price_data: {
            currency: 'EGP',
            product_data: {
              name: product.product.name,
              description: product.product.description,
              images: [product.product.mainImage.secure_url],
            },
            unit_amount: product.product.subPrice * 100,
          },
          quantity: product.quantity,
        })),
        discounts: discount,
      });
      // clear cart
      if (session) {
        const cart = await this.CRS.findOne({ filter: { userId: user._id } });
        if (!cart) {
          throw new BadRequestException('Cart not exist');
        }
        cart.products = [];
        await cart.save();
      }
      return { url: session.url };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------------------------------- web hook ----------------------------------
  async webHookService(data) {
    const orederId = data.data.object.metadata.orderId;
    const order = await this.ORS.findOneAndUpdate(
      { _id: orederId },
      {
        orderStatus: orderStatusTypes.paid,
        orderDetails: { paidAt: new Date() },
        paymentIntent: data.data.object.payment_intent,
      },
    );
    return { order };
  }

  // ---------------------------------- cancel order ----------------------------------
  async cancelOrder(orderId: Types.ObjectId, user: UserDocument) {
    try {
      const order = await this.ORS.findOneAndUpdate(
        {
          _id: orderId,
          orderStatus: {
            $in: [
              orderStatusTypes.pending,
              orderStatusTypes.placed,
              orderStatusTypes.paid,
            ],
          },
        },
        {
          orderStatus: orderStatusTypes.canceled,
          orderDetails: { canceledAt: new Date(), canceledBy: user._id },
        },
      );
      if (!order) {
        throw new BadRequestException('Order not exist');
      }
      if (order.userId.toString() != user._id.toString()) {
        throw new BadRequestException(
          'You are not allowed to cancel this order',
        );
      }
      if (order.paymentMethod == paymentMethodTypes.card) {
        await this.PMS.refundOrder({
          payment_intent: order.paymentIntent,
          reason: 'requested_by_customer',
        });
        await this.ORS.findOneAndUpdate(
          { _id: order._id },
          {
            orderStatus: orderStatusTypes.refunded,
            orderDetails: { refundedAt: new Date(), refundedBy: user._id },
          },
        );
      }
      return { msg: 'done' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
