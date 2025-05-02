import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";
import { Order, OrderDocument } from "../models";

@Injectable()
export class OrderRepositoryService extends DataBaseRepositoryService<OrderDocument>{
    constructor(@InjectModel(Order.name) private readonly _OrderModel:Model<OrderDocument>){
        super(_OrderModel);
    }
}