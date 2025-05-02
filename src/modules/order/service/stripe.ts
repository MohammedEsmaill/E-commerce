import { Injectable } from "@nestjs/common";
import{ Stripe }from "stripe";

@Injectable()
export class StripeService {
    constructor() {}
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    async createPaymentCheckoutSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email,
            metadata,
            success_url: 'http://localhost:3000/order/success',
            cancel_url: 'http://localhost:3000/order/cancel',
            line_items,
            discounts
        });
    }

    async createCoupon(percent_off: number) {
        return await this.stripe.coupons.create({
            duration: 'once',
            percent_off,
        });
    }

    async refundOrder({payment_intent,reason}) {
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        });
    }
}
