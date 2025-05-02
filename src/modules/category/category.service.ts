import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { generatecustomId } from 'src/common/security';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { CategoryRepositoryService, SubCategoryRepositoryService } from 'src/DB/Repository';
import { SubCategoryService } from '../subCategory/subCategory.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly CRS: CategoryRepositoryService,
        private readonly FUS : FileUploadService,
        private readonly SCRS: SubCategoryRepositoryService,
        private readonly SCS:SubCategoryService
    ) {}
    // ----------------------------- createCategory -----------------------------
    async createCategory(body,user,file) {
        const {name} = body;
        const categoryExist = await this.CRS.findOne({filter:{name:name.toLowerCase()}});
        if (categoryExist) {
            throw new BadRequestException('Category already exist');
        }
        let dummyData = {name:body.name,addedBy:user._id};
        if (file) {
            dummyData["customId"] = generatecustomId("category-"); 
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${dummyData["customId"]}`});
            dummyData["image"] = {secure_url,public_id};
        }
        const category = await this.CRS.create(dummyData);
        return {category};
    }   

    // ----------------------------- updateCategory -----------------------------
    async updateCategory(body,user,file,id) {
        const {name} = body;
        const category = await this.CRS.findOne({filter:{_id:id}});
        if (!category) {
            throw new BadRequestException('Category not exist');
        }
        if (category["addedBy"].toString() !== user._id.toString()) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        if (name) {
            if (category["name"] === name.toLowerCase()) {
                throw new BadRequestException('Category name already exist');
            }
            category.name = name;
            category.slug = slugify(name,{lower:true,replacement:"-"});
        }
        if (file) {
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${category["customId"]}`});
            await this.FUS.deleteFile(category.image["public_id"]);
            category.image = {secure_url,public_id};
        }
        await category.save();
        return {category};
        
    }

    // ---------------------------- deleteCategory -----------------------------
    async deleteCategory(user,id) {
        const category = await this.CRS.findOne({filter:{_id:id}});
        if (!category) {
            throw new BadRequestException('Category not exist');
        }
        if (category["addedBy"].toString() !== user._id.toString()) {
            throw new BadRequestException('You are not allowed to delete this category');
        }
        if (category["image"]) {
            await this.FUS.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${category["customId"]}`);
        }
        await this.CRS.deleteOne({_id:id});
        // delete all subCategories & brands & products
        const subCategories = await this.SCRS.find({filter:{category:id}});
        for (const subCategory of subCategories) {
            await this.SCS.deleteSubCategory(user,subCategory._id);
        }
        return {msg:"Category deleted successfully"};
    }
}
