import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/guards/auth';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerHost } from 'src/common/utils/multerHost';
import { ImageAllowedExtensions } from 'src/common/Types/Extinsions';
import { rolesTypes } from 'src/common/Types/types';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';
import { CreateProductDto, QueryDto, UpdateProductDto } from './dto/createProduct.dto';

@Controller("product")
export class ProductController {
    constructor(
        private readonly PS: ProductService
    ) {}
    // -------------------------- create product ----------------------------
    @Post("create")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(
            FileFieldsInterceptor([
                {name:"mainImage",maxCount:1},
                {name:"subImages",maxCount:10}
            ],
            multerHost({allowedExtensions:ImageAllowedExtensions})
        ))
    createProduct(
        @Body() body: CreateProductDto,
        @User() user:UserDocument,
        @UploadedFiles() files:{mainImage:Express.Multer.File[],subImages?:Express.Multer.File[]}
    ) {
        return this.PS.createProduct(body,user,files);
    }

    // -------------------------- update product ----------------------------
    @Patch("update/:id")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(
            FileFieldsInterceptor([
                {name:"mainImage",maxCount:1},
                {name:"subImages",maxCount:10}
            ],
            multerHost({allowedExtensions:ImageAllowedExtensions})
        ))
    updateProduct(
        @Body() body: UpdateProductDto,
        @User() user:UserDocument,
        @UploadedFiles() files:{mainImage:Express.Multer.File[],subImages?:Express.Multer.File[]},
        @Param("id") id:Types.ObjectId,
    ) {
        return this.PS.updateProduct(body,user,files,id);
    }

    // -------------------------- delete product ----------------------------
    @Delete("delete/:id")
    @Auth(rolesTypes.admin)
    deleteProduct(
        @User() user:UserDocument,
        @Param("id") id:Types.ObjectId,
    ) {
        return this.PS.deleteProduct(user,id);
    }
    // -------------------------- getAllProducts ----------------------------
    @Get("getAllProducts")
    getAllProducts(@Query() query:QueryDto) {
        return this.PS.getAllProducts(query);
    }
}
  