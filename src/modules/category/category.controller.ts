import { BadRequestException, Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/createCategory.dto';
import { CategoryService } from './category.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageAllowedExtensions } from 'src/common/Types/Extinsions';
import { multerHost } from 'src/common/utils/multerHost';
import { Types } from 'mongoose';
@Controller('category')
export class CategoryController {
    constructor(private readonly CS: CategoryService) {}
    // ----------------------------- createCategory -----------------------------
    @Post("create")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async createCategory(
        @Body() body: CreateCategoryDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.CS.createCategory(body,user,file);
    }
    // ----------------------------- updateCategory -----------------------------
    @Patch("update/:id")
    @Auth(rolesTypes.admin)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',multerHost({allowedExtensions:ImageAllowedExtensions})))
    async updateCategory(
        @Body() body: UpdateCategoryDto,
        @User() user:UserDocument,
        @UploadedFile() file: Express.Multer.File,
        @Param("id") id:Types.ObjectId
    ) {
        return this.CS.updateCategory(body,user,file,id);
    }
    // ---------------------------- deleteCategory -----------------------------
    @Delete("delete/:id")
    @Auth(rolesTypes.admin)
    async deleteCategory(@User() user:UserDocument,@Param("id") id:Types.ObjectId) {
        return this.CS.deleteCategory(user,id);
    }
}
