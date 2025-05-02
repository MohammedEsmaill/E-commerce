import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User,Category,SubCategory } from './index';
import { Brand } from './Brand.model';
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
  @Prop({ type: String,required: true, trim: true,minlength: 3, maxlength: 20 })
  name: string;
  @Prop({ type: String, trim: true,default:function(){
    return slugify(this.name,{lower:true,replacement:"-"});
  }})
  slug: string;
  @Prop({ type: Types.ObjectId,ref:User.name,required:true })
  addedBy: Types.ObjectId
  @Prop({ type: Object })
  mainImage: object
  @Prop({ type: [Object] })
  subImages: object[]
  @Prop({ type: String ,required: true, trim: true,minlength: 3, maxlength: 200 })
  description: string
  @Prop({ type: Number,required: true })
  price: number
  @Prop({ type: Number,required: true })
  quantity: number
  @Prop({ type: Number,required:true })
  stock: number
  @Prop({ type: Number,min:1,max:100 })
  discount: number
  @Prop({ type: Number,required: true })
  subPrice: number
  @Prop({ type: Number })
  rateNum: number
  @Prop({ type: Number })
  rateAvg: number
  @Prop({ type: String })
  customId:string
  @Prop({ type: Types.ObjectId,ref:Category.name,required:true })
  category: Types.ObjectId
  @Prop({ type: Types.ObjectId,ref:SubCategory.name,required:true })
  subCategory: Types.ObjectId
  @Prop({ type: Types.ObjectId,ref:Brand.name })
  brand: Types.ObjectId
}
 
export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = HydratedDocument<Product>;
export const productModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])