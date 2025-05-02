import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";
import { Coupon, CouponDocument } from "../models";

@Injectable()
export class CouponRepositoryService extends DataBaseRepositoryService<CouponDocument>{
    constructor(@InjectModel(Coupon.name) private readonly _CouponModel:Model<CouponDocument>){
        super(_CouponModel);
    }
}