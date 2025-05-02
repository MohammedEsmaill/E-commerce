import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import {  brandService } from './brand.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageAllowedExtensions } from 'src/common/Types/Extinsions';
import { multerHost } from 'src/common/utils/multerHost';
import { Types } from 'mongoose';
import { createBrandDto, UpdateBrandDto } from './dto/createBrand.dto';
@Controller('brand')
export class brandController {
    constructor(private readonly BS: brandService) {}
    // ----------------------------- createBrand -----------------------------
    @Post("create")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async createCategory(
        @Body() body: createBrandDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.BS.createBrand(body,user,file);
    }
    
    // ----------------------------- updateBrand -----------------------------
    @Patch("update/:id")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async updatebrand(
        @Body() body: UpdateBrandDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File,
        @Param("id") id:Types.ObjectId,
        @Param("subCategoryId") categoryId:Types.ObjectId
    ) {
        return this.BS.updateBrand(body,user,file,id);
    }
    // ---------------------------- deleteBrand -----------------------------
    @Delete("delete/:id")
    @Auth(rolesTypes.admin)
    async deleteBrand(@User() user:UserDocument,@Param("id") id:Types.ObjectId) {
        return this.BS.deleteBrand(user,id);
    }
}
