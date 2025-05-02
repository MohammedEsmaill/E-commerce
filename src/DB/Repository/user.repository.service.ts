import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../models/user.model";
import { Model} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";

@Injectable()
export class UserRepositoryService extends DataBaseRepositoryService<UserDocument>{
    constructor(@InjectModel(User.name) private readonly _UserModel:Model<UserDocument>){
        super(_UserModel);
    }
    
}