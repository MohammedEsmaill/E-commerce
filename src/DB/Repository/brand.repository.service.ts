import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";
import { Brand, BrandDocument } from "../models";

@Injectable()
export class BrandRepositoryService extends DataBaseRepositoryService<BrandDocument>{
    constructor(@InjectModel(Brand.name) private readonly _BrandModel:Model<BrandDocument>){
        super(_BrandModel);
    }
}