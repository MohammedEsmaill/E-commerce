import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Hash,Encrypt} from 'src/common/security/index';
import { genderTypes, rolesTypes } from 'src/common/Types/types';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ type: String,required: true, trim: true,minlength: 3, maxlength: 20 })
  name: string;
  @Prop({ type: String,required: true, trim: true,unique: true })
  email: string;
  @Prop({ type: String,required: true, trim: true })
  password: string;
  @Prop({ type: Date, required: true})
  DOB: Date;
  @Prop({ type: Boolean})
  confirmed: boolean;
  @Prop({ type: String,trim: true,default:rolesTypes.user })
  role: string;
  @Prop({ type: String, required: true, trim: true,minlength: 11, maxlength: 11 })
  phone: string;
  @Prop({ type: Boolean})
  isDeleted: boolean;
  @Prop({ type: Boolean})
  isBlocked: boolean;
  @Prop({ type:String,required:true})
  address:string;
  @Prop({ type:String,default:genderTypes.male,enum:genderTypes})
  gender:string
}
 
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = Hash(this.password);
  }
  if (this.isModified("phone")) {
    this.phone = Encrypt(this.phone);
  }
  next();
})
export type UserDocument = HydratedDocument<User>;
export const userModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])