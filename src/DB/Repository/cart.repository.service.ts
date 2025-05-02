import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";
import { Cart, CartDocument } from "../models";

@Injectable()
export class CartRepositoryService extends DataBaseRepositoryService<CartDocument>{
    constructor(@InjectModel(Cart.name) private readonly _CartModel:Model<CartDocument>){
        super(_CartModel);
    }
}