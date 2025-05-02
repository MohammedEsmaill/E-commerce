import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { generatecustomId } from 'src/common/security';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { rolesTypes } from 'src/common/Types/types';
import { BrandRepositoryService, ProductRepositoryService, SubCategoryRepositoryService } from 'src/DB/Repository';

@Injectable()
export class brandService {
    constructor(
        private readonly BRS: BrandRepositoryService,
        private readonly SCRS: SubCategoryRepositoryService,
        private readonly FUS : FileUploadService,
        private readonly PRS: ProductRepositoryService
    ) {}
    // ----------------------------- createBrand -----------------------------
    async createBrand(body,user,file) {
        const {name,subCategoryId} = body;
        const subCategory = await this.SCRS.findOne({filter:{_id:subCategoryId},populate:[{path:"category"}]});
        if (!subCategory) {
            throw new BadRequestException('SubCategory not exist');
        }
        if (!subCategory?.category) {
            throw new BadRequestException('Category not exist');
        }
        if (subCategory["addedBy"].toString() !== user._id.toString() && subCategory["category"]["addedBy"].toString() !== user._id.toString() && user.role !== rolesTypes.admin) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        if (await this.BRS.findOne({filter:{name:name.toLowerCase()}})) {
            throw new BadRequestException('Brand already exist');
        }
        let dummyData = {name:body.name,addedBy:user._id,subCategory:subCategory._id,category:subCategory.category._id};
        if (file) {
            dummyData["customId"] = generatecustomId("brand-");
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${subCategory.category["customId"]}/subCategories/${subCategory["customId"]}/brand/${dummyData["customId"]}`});
            dummyData["image"] = {secure_url,public_id};
        }
        const brand = await this.BRS.create(dummyData);
        return {brand}
    } 

    // ----------------------------- updateBrand -----------------------------
    async updateBrand(body,user,file,id) {
        const {name} = body;
        const brand = await this.BRS.findOne({filter:{_id:id},populate:[{path:"subCategory"},{path:"category"}]});
        if (!brand) {
            throw new BadRequestException('Brand not exist');
        }
        if (!brand?.subCategory) {
            throw new BadRequestException('SubCategory not exist');
        }
        if (!brand?.category) {
            throw new BadRequestException('Category not exist');
        }
        if (brand["addedBy"].toString() !== user._id.toString() &&
            brand.category["addedBy"].toString() !== user._id.toString() &&
            brand.subCategory["addedBy"].toString() !== user._id.toString() &&
            user.role !== rolesTypes.admin
        ) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        if (name) {
            if (brand["name"] === name.toLowerCase()) {
                throw new BadRequestException('Brand name already exist');
            }
            brand.name = name;
            brand.slug = slugify(name,{lower:true,replacement:"-"});
        }
        if (file) {
            if (brand["image"]) {
                await this.FUS.deleteFile(brand["image"]["public_id"]);
            }
            const {secure_url,public_id} = await this.FUS.uploadFile(file,{folder:`${process.env.CLOUDINARY_FOLDER}/category/${brand.category["customId"]}/subCategories/${brand.subCategory["customId"]}/brand/${brand["customId"]}`});
            brand.image = {secure_url,public_id};
        }
        await brand.save();
        return {msg:"Brand updated successfully",brand};
    }

    // ----------------------------- deleteBrand -----------------------------</a>
    async deleteBrand(user,id) {
        const brand = await this.BRS.findOne({filter:{_id:id},populate:[{path:"subCategory"},{path:"category"}]});
        if (!brand) {
            throw new BadRequestException('Brand not exist');
        }
        if (brand["addedBy"].toString() !== user._id.toString() && user.role !== rolesTypes.admin) {
            throw new BadRequestException('You are not allowed to update this category');
        }
        await this.BRS.deleteOne({_id:id});
        // delete all products of this brand
        await this.PRS.deleteMany({brand:brand._id});
        // delete all images of this brand
        await this.FUS.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${brand.category["customId"]}/subCategories/${brand.subCategory["customId"]}/brand/${brand["customId"]}`);
        return {msg:"Brand deleted successfully"};
    }
}
