import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Coupon {
  @Prop({ type: String,required: true, trim: true,minlength: 3, maxlength: 20 })
  code: string;
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  addedBy: Types.ObjectId
  @Prop({ type: Number,required: true,min:1,max:100 })
  discount: number
  @Prop({ type: Date,required: true })
  startAt: Date
  @Prop({ type: Date,required: true })
  expireAt: Date
  @Prop({ type: [Types.ObjectId],ref:User.name,required:true })
  usedBy: Types.ObjectId[]
}
 
 
export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = HydratedDocument<Coupon>;
export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])