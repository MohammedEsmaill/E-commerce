import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument} from "../models/product.model";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";

@Injectable()
export class ProductRepositoryService extends DataBaseRepositoryService<ProductDocument>{
    constructor(@InjectModel(Product.name) private readonly _ProductModel:Model<ProductDocument>){
        super(_ProductModel);
    }
} 