import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { Product } from "./product.model";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Cart {
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  userId: Types.ObjectId;
  @Prop({ type:[{
    product: {type:Types.ObjectId,ref:Product.name,required:true},
    quantity: { type: Number,required: true,min:1},
    finalPrice: { type: Number,required: true}
  }]})
  products: {product:Types.ObjectId,quantity:number,finalPrice:number}[];
  @Prop({ type: Number })
  subTotal: number
} 
export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.pre('save',function(next){
  this.subTotal = this.products.reduce((prev,curr) => prev + (curr.finalPrice * curr.quantity),0)
  next()
})
export type CartDocument = HydratedDocument<Cart>;
export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])