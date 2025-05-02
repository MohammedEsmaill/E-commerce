import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OTP, OTPDocument } from "../models/otp.model";
import { Model, Types} from "mongoose";
import { DataBaseRepositoryService } from "./DataBaseRepository";
import { otpTypes } from "src/common/Types/types";

interface generateOtp{
    otp:string,
    otpType:otpTypes,
    userId:Types.ObjectId
}
@Injectable()
export class OTPRepositoryService extends DataBaseRepositoryService<OTPDocument>{
    constructor(@InjectModel(OTP.name) private readonly _OTPModel:Model<OTPDocument>){
        super(_OTPModel);
    }
    createOtp({otp,otpType,userId}:generateOtp){
        return this._OTPModel.create({otp,otpType,userId});
    }
}