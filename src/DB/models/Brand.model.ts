import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { Category, SubCategory, User } from "./index";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Brand {
  @Prop({ type: String,required: true, trim: true,minlength: 3, maxlength: 20 })
  name: string;
  @Prop({ type: String, trim: true,default:function(){
    return slugify(this.name,{lower:true,replacement:"-"});
  }})
  slug: string;
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  addedBy: Types.ObjectId
  @Prop({ type: Object })
  image: object
  @Prop({ type: String })
  customId:string
  @Prop({ type: Types.ObjectId,ref:Category.name,required:true })
  category: Types.ObjectId
  @Prop({ type: Types.ObjectId,ref:SubCategory.name,required:true })
  subCategory: Types.ObjectId
}
 
 
export const BrandSchema = SchemaFactory.createForClass(Brand);
export type BrandDocument = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])