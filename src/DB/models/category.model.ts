import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Category {
  @Prop({ type: String,required: true, trim: true,unique: true,lowercase: true,minlength: 3, maxlength: 20 })
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
}
 
export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = HydratedDocument<Category>;
export const categoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])