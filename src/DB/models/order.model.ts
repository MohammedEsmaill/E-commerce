import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User,Cart, Coupon } from "./index";
import { orderStatusTypes, paymentMethodTypes } from "src/common/Types/types";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Order {
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  userId: Types.ObjectId
  @Prop({ type: Types.ObjectId,ref:Cart.name,required:true })
  cartId: Types.ObjectId
  @Prop({ type: String,required: true, trim: true})
  address:string
  @Prop({ type: Number})
  totalPrice:number
  @Prop({ type: String,trim: true,minlength: 11, maxlength: 11,regex:/^01[0125][0-9]{8}$/ })
  phone:string
  @Prop({ type: String,enum:paymentMethodTypes,required: true })
  paymentMethod:string
  @Prop({ type: String,enum:orderStatusTypes,required: true })
  orderStatus:string
  @Prop({type:Date,default:new Date(Date.now()+3*24*60*60*1000)})
  ArivessalDate:Date
  @Prop({type:Types.ObjectId,ref:Coupon.name})
  coupon:Types.ObjectId
  @Prop({type:{
    paidAt:Date,
    deliveredAt:Date,
    deliveredBy:{type:Types.ObjectId,ref:User.name},
    canceledAt:Date,
    canceledBy:{type:Types.ObjectId,ref:User.name},
    refundedAt:Date,
    refundedBy:{type:Types.ObjectId,ref:User.name}
  }})
  orderDetails:object
  @Prop({type:String})
  paymentIntent:string
}
 
 
export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])