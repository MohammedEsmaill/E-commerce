import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { otpTypes } from 'src/common/Types/types';
import { Hash } from 'src/common/security/Hash';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class OTP {
  @Prop({ type: String,required: true, trim: true})
  otp: string;
  @Prop({ type: String,required: true,enum:otpTypes})
  otpType: string
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  userId: Types.ObjectId;
  @Prop({ type: Date, default: Date.now() + (10 * 60 * 1000)})
  expriesAt: Date
}
 
export const OTPSchema = SchemaFactory.createForClass(OTP);
OTPSchema.pre("save", function (next) {
  this.otp = Hash(this.otp);
  next();
})
export type OTPDocument = HydratedDocument<OTP>;
export const OTPModel = MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])