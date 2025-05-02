import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import {
  BrandRepositoryService,
  ProductRepositoryService,
} from 'src/DB/Repository';
import { ProductDocument, UserDocument } from 'src/DB/models';
import { FilterQuery, Types } from 'mongoose';
import { generatecustomId } from 'src/common/security';
import { CreateProductDto, QueryDto, UpdateProductDto } from './dto/createProduct.dto';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    private readonly PRS: ProductRepositoryService,
    private readonly BRS: BrandRepositoryService,
    private readonly FUS: FileUploadService,
  ) {}
  // -------------------------- create product ----------------------------
  async createProduct(
    body: CreateProductDto,
    user: UserDocument,
    files: {
      mainImage: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    }
  ) {
    const {name,price,stock,quantity,description,brandId} = body 
    const discount = body.discount || 0
    const brand = await this.BRS.findOne({ filter: { _id: brandId }, populate: [{ path: 'subCategory' }, { path: 'category' }] });
    if (!brand) {
      throw new BadRequestException('Brand not exist');
    }
    if (!brand?.subCategory) {
      throw new BadRequestException('SubCategory not exist');
    }
    if (!brand?.category) {
      throw new BadRequestException('Category not exist');
    }
    if (
      brand['addedBy'].toString() !== user._id.toString() &&
      brand['subCategory']['addedBy'].toString() !== user._id.toString() &&
      brand['category']['addedBy'].toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new BadRequestException(
        'You are not allowed to update this category',
      );
    }
    if (!files.mainImage) {
      throw new BadRequestException('product mainImage is required');
    }
    const customId = generatecustomId('product-');
    const { secure_url, public_id } = await this.FUS.uploadFile(
      files.mainImage[0],
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subCategories/${brand.subCategory['customId']}/brand/${brand['customId']}/product/${customId}`,
      },
    );
    let subImages:{secure_url:string,public_id:string}[] = []
    if (files.subImages) {
      subImages = await this.FUS.UploadedFiles(files.subImages,{
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subCategories/${brand.subCategory['customId']}/brand/${brand['customId']}/product/${customId}`,
      })
    }
    const subPrice = price - ((price * (discount || 0)) / 100);
    const product = await this.PRS.create({
      name,
      price,
      stock,
      quantity,
      description,
      discount,
      subPrice,
      mainImage: { secure_url, public_id },
      subImages,
      brand: brand._id,
      subCategory: brand.subCategory._id,
      category: brand.category._id,
      addedBy: user._id,
    })
    return {product}
  }

  // -------------------------- update product ----------------------------
  async updateProduct(
    body: UpdateProductDto,
    user: UserDocument,
    files: {
      mainImage: Express.Multer.File[];
      subImages?: Express.Multer.File[];
    },
    id: Types.ObjectId
  ) {
    try {
      const {name,price,quantity,description,discount,stock} = body
    const product = await this.PRS.findOne({filter:{_id:id}});
    if (!product) {
      throw new BadRequestException('Product not exist');
    }
    const brand = await this.BRS.findOne({filter:{_id:product['brand']},populate:[{path:"subCategory"},{path:"category"}]});
    if (!brand) {
      throw new BadRequestException('Brand not exist');
    }
    if (!brand?.subCategory) {
      throw new BadRequestException('SubCategory not exist');
    }
    if (!brand?.category) {
      throw new BadRequestException('Category not exist');
    }
    if (
      product['addedBy'].toString() !== user._id.toString() &&
      brand['addedBy'].toString() !== user._id.toString() &&
      brand['subCategory']['addedBy'].toString() !== user._id.toString() &&
      brand['category']['addedBy'].toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new BadRequestException(
        'You are not allowed to update this category',
      );
    }
    if (name) {
      if (product['name'] === name.toLowerCase()) {
        throw new BadRequestException('Product name already exist');
      }
      product.name = name;
      product.slug = slugify(name, { lower: true, replacement: '-' });
    }
    if (price) {
      if (product['price'] === price) {
        throw new BadRequestException('the price must be different');
      }
      product.price = price;
      product.subPrice = price - ((price * (product.discount || 0)) / 100);
    }
    if (discount) {
      
      product.discount = discount;
      product.subPrice = price - ((price * (discount || 0)) / 100);
    }
    if (quantity) {
      product.quantity = +product.quantity + +quantity;
    }
    if (stock) {
      if (+product.stock + +stock > product.quantity) {
        throw new BadRequestException('Product stock must be less than quantity');
      }
      product.stock = +product.stock + +stock;
    }
    if (description) {
      product.description = description;
    }
    if (files.mainImage) {
      await this.FUS.deleteFile(product.mainImage['public_id']);
      const { secure_url, public_id } = await this.FUS.uploadFile(
        files.mainImage[0],
        {
          folder: `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subCategories/${brand.subCategory['customId']}/brand/${brand['customId']}/product/${product.customId}`,
        },
      );
      product.mainImage = { secure_url, public_id };
    }
    if (files.subImages) {
      if (product.subImages) {
        for (const image of product.subImages) {
          await this.FUS.deleteFile(image['public_id']);
        }
      }
      const subImages = await this.FUS.UploadedFiles(files.subImages, {
        folder: `${process.env.CLOUDINARY_FOLDER}/category/${brand.category['customId']}/subCategories/${brand.subCategory['customId']}/brand/${brand['customId']}/product/${product.customId}`,
      });
      product.subImages = subImages;
    }
    await product.save();
    return { product };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // -------------------------- delete product ----------------------------
  async deleteProduct( user: UserDocument, id: Types.ObjectId ) {
    const product = await this.PRS.findOne({filter:{_id:id}});
    if (!product) {
      throw new BadRequestException('Product not exist');
    }
    if (
      product['addedBy'].toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new BadRequestException('You are not allowed to delete this product');
    }
    if (product.mainImage) {
      await this.FUS.deleteFile(product.mainImage['public_id']);
    }
    if (product.subImages) {
      for (const image of product.subImages) {
        await this.FUS.deleteFile(image['public_id']);
      }
    }
    await this.PRS.deleteOne({ _id: id });
    return { message: 'Product deleted successfully' };
  }

  // -------------------------- get all products ---------------------------
  async getAllProducts(query:QueryDto) {
    const {name,select,sort,page} = query
    let filterObj:FilterQuery<ProductDocument> = {}
    if (name) {
      filterObj = {
        $or:[
          {name:{$regex:name,$options:'i'}},
          {slug:{$regex:name,$options:'i'}}]
      }
    }
    const products = await this.PRS.find({
      filter:filterObj,
      populate:[
        {path:"brand"},
        {path:"category"},
        {path:"subCategory"}
      ],
      select,
      sort,
      page
    });
    return { products };
  }
}
