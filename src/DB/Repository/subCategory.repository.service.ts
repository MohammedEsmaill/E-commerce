import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SubCategory, SubCategoryDocument } from "../models/subCategory.model";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";

@Injectable()
export class SubCategoryRepositoryService extends DataBaseRepositoryService<SubCategoryDocument>{
    constructor(@InjectModel(SubCategory.name) private readonly _SubCategoryModel:Model<SubCategoryDocument>){
        super(_SubCategoryModel);
    }
    
}