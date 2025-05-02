import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CartRepositoryService,
  ProductRepositoryService,
} from 'src/DB/Repository';
import { createCartDto, updateCartDto } from './dto/createCart.dto';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly CRS: CartRepositoryService,
    private readonly PRS: ProductRepositoryService,
  ) {}
  // ---------------------------------- add to cart ----------------------------------
  async addToCart(body: createCartDto, user: UserDocument) {
    try {
      const { quantity, productId } = body;
      //   check if product exist
      const product = await this.PRS.findOne({ filter: { _id: productId } });
      if (!product) {
        return new BadRequestException('Product not exist');
      }
      //   check if stock is enough
      if (product.stock < quantity) {
        return new BadRequestException('Out of stock');
      }
      //   check if user has cart
      const cart = await this.CRS.findOne({ filter: { userId: user._id } });
      if (!cart) {
        console.log(productId);
        console.log(typeof productId);

        return await this.CRS.create({
          userId: user._id,
          products: [
            { product: product._id, quantity, finalPrice: product.subPrice },
          ],
        });
      }
      //   check if product already exist in cart
      const productExist = cart.products.findIndex(
        (p) => p.product.toString() === product._id.toString(),
      );
      if (productExist === -1) {
        cart.products.push({
          product: product._id,
          quantity,
          finalPrice: product.subPrice,
        });
        await cart.save();
        return { cart };
      }
      cart.products[productExist].quantity += +quantity;
      await cart.save();
      return { cart };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  
  //   ---------------------------------- delete product from cart ----------------------------------
  async deleteProductFromCart(user: UserDocument, body: { productId: Types.ObjectId }) {
      try {
          const { productId } = body;
      const cart = await this.CRS.findOne({ filter: { userId: user._id } });
      if (!cart) {
          return new BadRequestException('Cart not exist');
        }
        const productExist = cart.products.find((p) => p.product.toString() === productId.toString());
        if (!productExist) {
            return new BadRequestException('Product not exist in cart');
        }
        cart.products.filter((p) => p.product.toString() !== productId.toString());
        await cart.save();
        return { cart };
    } catch (error) {
        return new BadRequestException(error);
    }
}


async updateCart(body:updateCartDto,user: UserDocument) {
    try {
        const { productId, quantity } = body;
        const cart = await this.CRS.findOne({ filter: { userId: user._id } });
        if (!cart) {
            return new BadRequestException('Cart not exist');
        }
        const productExist = cart.products.findIndex((p) => p.product.toString() === productId.toString());
        if (productExist === -1) {
            return new BadRequestException('Product not exist in cart');
        }
        const product = await this.PRS.findOne({ filter: { _id: productId } });
        if (!product) {
            return new BadRequestException('Product not exist');
        }
        cart.products[productExist].quantity += +quantity;
        if (product.stock < cart.products[productExist].quantity) {
            return new BadRequestException('Out of stock');
        }
        cart.products[productExist].finalPrice = product.subPrice * cart.products[productExist].quantity;
        if (cart.products[productExist].quantity === 0) {
            cart.products.filter((p) => p.product.toString() !== productId.toString());
        }
        await cart.save();
        return { cart };
    } catch (error) {
        return new BadRequestException(error);
    }
}

//   ---------------------------------- get cart ----------------------------------
  async getCart(user: UserDocument) {
    try {
      const cart = await this.CRS.findOne({ filter: { userId: user._id } });
      if (!cart) {
        return new BadRequestException('Cart not exist');
      }
      return { cart };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

//   ---------------------------------- clear cart ----------------------------------
  async clearCart(user: UserDocument) {
    try {
      const cart = await this.CRS.findOne({ filter: { userId: user._id } });
      if (!cart) {
        return new BadRequestException('Cart not exist');
      }
      cart.products = [];
      await cart.save();
      return { cart };
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}