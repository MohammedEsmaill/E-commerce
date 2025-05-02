import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { generatecustomId } from 'src/common/security';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { rolesTypes } from 'src/common/Types/types';
import { BrandRepositoryService, CategoryRepositoryService, SubCategoryRepositoryService } from 'src/DB/Repository';
import { brandService } from '../brand/brand.service';
import { Types } from 'mongoose';
import { UserDocument } from 'src/DB/models';

@Injectable()
export class SubCategoryService {
    constructor(
        private readonly SCRS: SubCategoryRepositoryService,
        private readonly CRS: CategoryRepositoryService,
        private readonly FUS : FileUploadService,
        private readonly BS: brandService,
        private readonly BRS:BrandRepositoryService
    ) {}
    // ----------------------------- createSubCategory -----------------------------
    async createSubCategory(body,user,file) {
        const {name,categoryId} = body;
        // check if category exist
        const category = await this.CRS.findOne({filter:{_id:categoryId}});
        if (!category) {
            throw new BadRequestException('Category not exist');
        }
        // check if user is allowed to create this category
        if (category["addedBy"].toString() !== user._id.toString() && user.role !== rolesTypes.admin) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        // check if subCategory already exist
        if (await this.SCRS.findOne({filter:{name:name.toLowerCase()}})) {
            throw new BadRequestException('subCategory already exist');
        }

        let dummyData = {name:body.name,addedBy:user._id,category:category._id};
        if (file) {
            dummyData["customId"] = generatecustomId("subCategory-"); 
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${category["customId"]}/subCategories/${dummyData["customId"]}`});
            dummyData["image"] = {secure_url,public_id};
        }
        const SubCategory = await this.SCRS.create(dummyData);
        return {SubCategory};
    }   

    // ----------------------------- updateSubCategory -----------------------------
    async updateSubCategory(body,user,file,id) {
        const {name} = body;
        const subcategory = await this.SCRS.findOne({filter:{_id:id},populate:[{path:"category"}]});
        if (!subcategory) {
            throw new BadRequestException('SubCategory not exist');
        }
        if (subcategory["addedBy"].toString() !== user._id.toString() && user.role !== rolesTypes.admin) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        if (!subcategory.category) {
            throw new BadRequestException('Category not exist');
        }
        if (name) {
            if (subcategory["name"] === name.toLowerCase()) {
                throw new BadRequestException('subCategory name already exist');
            }
            subcategory.name = name;
            subcategory.slug = slugify(name,{lower:true,replacement:"-"});
        }
        if (file) {
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${subcategory.category["customId"]}/subCategories/${subcategory["customId"]}`});
            if (subcategory.image["public_id"]) {
                await this.FUS.deleteFile(subcategory.image["public_id"]);
            }
            subcategory.image = {secure_url,public_id};
        }
        await subcategory.save();
        return {subcategory};
        
    }

    // ---------------------------- deleteSubCategory -----------------------------
    async deleteSubCategory(user:UserDocument,id:Types.ObjectId) {
        const subcategory = await this.SCRS.findOne({filter:{_id:id},populate:[{path:"category"}]});
        if (!subcategory) {
            throw new BadRequestException('SubCategory not exist');
        }
        if (subcategory["addedBy"].toString() !== user._id.toString() && user.role !== rolesTypes.admin) {
            throw new BadRequestException('You are not allowed to delete this category');
        }
        if (subcategory["image"]) {
            await this.FUS.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${subcategory.category["customId"]}/subCategories/${subcategory["customId"]}`);
        }
        const brands = await this.BRS.find({filter:{subCategory:id}});
        for (const brand of brands) {
            await this.BS.deleteBrand(user,brand._id);
        }
        await this.SCRS.deleteOne({_id:id});
        return {msg:"Category deleted successfully"};
    }
}
