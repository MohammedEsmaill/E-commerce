import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "../models/category.model";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";

@Injectable()
export class CategoryRepositoryService extends DataBaseRepositoryService<CategoryDocument>{
    constructor(@InjectModel(Category.name) private readonly _CategoryModel:Model<CategoryDocument>){
        super(_CategoryModel);
    }
    
}