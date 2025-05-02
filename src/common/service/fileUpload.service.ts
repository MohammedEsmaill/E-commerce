import { Injectable } from "@nestjs/common";
import { cloudinaryConfig } from "./../cloudinary/cloudinary";
import { UploadApiOptions } from "cloudinary";
import { Express } from "express";
@Injectable()
export class FileUploadService {
    constructor() {}
    private _cloudinary = cloudinaryConfig();
    async uploadFile(file: Express.Multer.File,options:UploadApiOptions) {
        return await  this._cloudinary.uploader.upload(file.path, options);
    }
    async UploadedFiles(files: Express.Multer.File[],options:UploadApiOptions) {
        let result :{secure_url:string,public_id:string}[]= [];
        for (const file of files) {
            const {secure_url,public_id} = await this.uploadFile(file,options)
            result.push({secure_url,public_id})
        }
        return result
    }
    async deleteFile(public_id:string) {
        return await this._cloudinary.uploader.destroy(public_id);
    }
    async deleteFolder(filePath:string) {
        await this._cloudinary.api.delete_resources_by_prefix(filePath);
        return await this._cloudinary.api.delete_folder(filePath);
    }
}