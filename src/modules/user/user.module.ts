import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { userModel,OTPModel } from "src/DB/models/index";
import { UserRepositoryService,OTPRepositoryService } from "src/DB/Repository/index";
import { TokenService } from "src/common/service/token";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[userModel,OTPModel],
    providers:[userService,UserRepositoryService,TokenService,JwtService,OTPRepositoryService],
    controllers:[userController]
})
export class userModule{

}