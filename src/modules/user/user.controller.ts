import { Body, Controller, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { userService } from "./user.service";
import { changePasswordDto, confirmEmailDto, loginDto, resetPasswordDto, sendOtpDto, signUpDto, updateUserDto } from "./dto/userDto";
import { UserDocument } from "src/DB/models/user.model";
import { rolesTypes } from "src/common/Types/types";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/guards/auth";
import { Types } from "mongoose";

@Controller("users")
export class userController{
    constructor(private readonly _userService:userService){}
    // ----------------------------- signUp -----------------------------
    @Post("/signup")
    @UsePipes(new ValidationPipe({}))
    signUp(@Body() body:signUpDto){
        return this._userService.signUp(body);
    }
    // ---------------------------- sendOtp -----------------------------
    @Post("/sendOtp")
    @UsePipes(new ValidationPipe({}))
    sendOtp(@Body() body:sendOtpDto){
        return this._userService.sendOtp(body);
    }
    // ---------------------------- confirmEmail -----------------------------
    @Patch("/confirmEmail")
    @UsePipes(new ValidationPipe())
    confirmEmail(@Body() body:confirmEmailDto){
        return this._userService.confirmEmail(body);
    }
    // ---------------------------- logIn -----------------------------
    @Post("/logIn")
    logIn(@Body() body:loginDto){
        return this._userService.logIn(body);
    }
    // ---------------------------- Get profile -----------------------------
    @Get("/profile")
    @Auth(rolesTypes.user,rolesTypes.admin)
    @HttpCode(200)    
    async profile(@User() user:UserDocument) {
        return { user };
    }
    // ----------------------------- forgetPassword --------------------------
    @Post("/forgetPassword")
    @UsePipes(new ValidationPipe({}))
    forgetPassword(
        @Body() body:sendOtpDto
    ){
        return this._userService.sendOtp(body);
    }
    // ---------------------------- resetPassword ----------------------------
    @Post("/resetPassword")
    @UsePipes(new ValidationPipe({}))
    resetPassword(
        @Body() body:resetPasswordDto
    ){
        return this._userService.resetPassword(body);
    }
    // ---------------------------- changePassword --------------------------
    @Patch("/changePassword")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.user,rolesTypes.admin)
    changePassword(
        @Body() body:changePasswordDto
    ){
        return this._userService.changePassword(body);
    }
    // ---------------------------- updateUser -----------------------------
    @Post("/updateUser")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.user,rolesTypes.admin)
    updateUser(@User() user:UserDocument,@Body() body:updateUserDto){
        return this._userService.updateUser(user,body);
    }
    // ---------------------------- blockUser -----------------------------
    @Patch("/blockUser/:id")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.admin)
    blockUser(
        @User() user:UserDocument,
        @Param("id") id:Types.ObjectId,
    ){
        return this._userService.blockUser(user,id);
    }
    // ---------------------------- unblockUser ----------------------------
    @Patch("/unblockUser/:id")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.admin)
    unblockUser(
        @User() user:UserDocument,
        @Param("id") id:Types.ObjectId,
    ){
        return this._userService.unblockUser(user,id);
    }
    // ---------------------------- deleteAccount ---------------------------
    @Patch("/deleteAccount")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.user,rolesTypes.admin)
    deleteAccount(@User() user:UserDocument){
        return this._userService.deleteAccount(user);
    }
    // ---------------------------- updateUserRole --------------------------
    @Patch("/updateUserRole/:id")
    @UsePipes(new ValidationPipe({}))
    @Auth(rolesTypes.admin)
    updateUserRole(@Param("id") id:Types.ObjectId){
        return this._userService.updateUserRole(id);
    }
}