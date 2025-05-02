import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { sendEmail,html } from 'src/common/utils/Email/index';
import {
  UserRepositoryService,
  OTPRepositoryService,
} from 'src/DB/Repository/index';
import { changePasswordDto, confirmEmailDto, loginDto, resetPasswordDto, sendOtpDto, signUpDto, updateUserDto } from './dto/userDto';
import { compare,generateOtp } from 'src/common/security/index';
import { TokenService } from 'src/common/service/token';
import { otpTypes, rolesTypes } from 'src/common/Types/types';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';
@Injectable()
export class userService {
  constructor(
    private readonly URS: UserRepositoryService,
    private readonly OTPRS: OTPRepositoryService,
    private readonly TS: TokenService,
  ) {}
  // ----------------------------- signUp -----------------------------
  async signUp(body: signUpDto) {
    try {
      const { email } = body;
      const userExist = await this.URS.findOne({filter:{email}});
      if (userExist) {
        throw new ConflictException('User already exist');
      }
      const user = await this.URS.create({ ...body });
      const otp = generateOtp();
      await sendEmail({
        to: email,
        subject: 'confirm email',
        html: html({ msg: 'confirm Email', otp }),
      });
      await this.OTPRS.createOtp({
        otp,
        otpType: otpTypes.confirmation,
        userId: user._id,
      });
      return user;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
  // ----------------------------- sendOtp -----------------------------
  async sendOtp(body: sendOtpDto) {
    try {
      const { email,otpType } = body;
      const userExist = await this.URS.findOne({filter:{ email,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
      if (!userExist) {
        throw new BadRequestException('User does not exist');
      }
      const otp = generateOtp();
      if (otpType == otpTypes.forgetPassword) {
        const emailSent = await sendEmail({
          to: email,
          subject: 'forget password',
          html: html({ msg: 'forget password', otp }),
        });
        if (!emailSent) {
          throw new BadRequestException('failed to send email');
        }
        await this.OTPRS.findOneAndDelete({ userId: userExist._id, otpType: otpTypes.forgetPassword });
        await this.OTPRS.createOtp({
          otp,
          otpType: otpTypes.forgetPassword,
          userId: userExist._id,
        });
        return { msg: 'otp sent successfully' };
      }
      if (otpType == otpTypes.confirmation) {
        const emailSent = await sendEmail({
          to: email,
          subject: 'confirm email',
          html: html({ msg: 'confirm Email', otp }),
        });
        if (!emailSent) {
          throw new BadRequestException('failed to send email');
        }
        await this.OTPRS.findOneAndDelete({ userId: userExist._id, otpType: otpTypes.confirmation });
        await this.OTPRS.createOtp({
          otp,
          otpType: otpTypes.confirmation,
          userId: userExist._id,
        });
        return { msg: 'otp sent successfully' };
      }
    } catch (error) {
      return new BadRequestException(error);
    }
    }

  // ----------------------------- confirmEmail -----------------------------
  async confirmEmail(body: confirmEmailDto) {
    try {
      const { email, otp } = body;
      const user = await this.URS.findOne({filter:{ email, confirmed: {$exists:false} }});
      if (!user) {
        throw new NotFoundException('User not exist or already confirmed');
      }
      const otpExist = await this.OTPRS.findOne({filter:{ userId: user._id , otpType: otpTypes.confirmation}});
      if (!otpExist) {
        throw new ForbiddenException('incorrect data');
      }
      if (otpExist.expriesAt < new Date(Date.now())) {
        throw new ForbiddenException('otp expired');
      }
      if (!compare(otp,otpExist.otp)) {
        throw new ForbiddenException('incorrect otp');
      }
      await this.URS.findOneAndUpdate({ email }, { confirmed: true });
      await this.OTPRS.findOneAndDelete({ userId: user._id });
      return { msg: 'email confirmed successfully' };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  // ----------------------------- logIn -----------------------------
  
  async logIn(body: loginDto) {
    try {
      const { email, password } = body;
      const userExist = await this.URS.findOne({filter:{ email,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
      if (!userExist) {
        throw new BadRequestException('User does not exist or not confirmed yet');
      }
      if (!compare(password, userExist.password)) {
        throw new ForbiddenException('Invalid password');
      }
      const access_token = await this.TS.generateToken(
        { email },
        { secret: userExist.role == rolesTypes.admin ? process.env.ACCESS_TOKEN_SIGNTURE_ADMIN : process.env.ACCESS_TOKEN_SIGNTURE_USER, expiresIn: '1w'},
      );
      const refresh_token = await this.TS.generateToken(
        { email },
        { secret: userExist.role == rolesTypes.admin ? process.env.REFRESH_TOKEN_SIGNTURE_ADMIN : process.env.REFRESH_TOKEN_SIGNTURE_USER, expiresIn: '1y'},
      );
      return { msg: 'user loggedIn successfully', access_token, refresh_token};
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  // ------------------------------ resetPassword -----------------------------
  async resetPassword(body: resetPasswordDto) {
    try {
      const { email, otp, password } = body;
      const userExist = await this.URS.findOne({filter:{ email,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
      if (!userExist) {
        throw new BadRequestException('User does not exist');
      }
      const otpExist = await this.OTPRS.findOne({filter:{ userId: userExist._id , otpType: otpTypes.forgetPassword}});
      if (!otpExist) {
        throw new ForbiddenException('incorrect data');
      }
      if (otpExist.expriesAt.getTime() < new Date(Date.now()).getTime()) {
        throw new ForbiddenException('otp expired');
      }
      if (!compare(otp,otpExist.otp)) {
        throw new ForbiddenException('incorrect otp');
      }
      await this.URS.findOneAndUpdate({ email }, { password });
      await this.OTPRS.findOneAndDelete({ userId: userExist._id });
      return { msg: 'password reset successfully' };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  // ----------------------------- changePassword -----------------------------
  async changePassword(body:changePasswordDto){
    const { email,password,newPassword } = body;
    const user = await this.URS.findOne({filter:{email,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!compare(password,user.password)) {
      throw new ForbiddenException('Invalid password');
    }
    await this.URS.findOneAndUpdate({ email }, { password: newPassword });
    return { msg: 'password changed successfully' };
  }

  async updateUser(user:UserDocument,body:updateUserDto){
    const userExist = await this.URS.findOne({filter:{_id:user._id,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    await this.URS.findOneAndUpdate({ _id:user._id }, { ...body });
    return { msg: 'user updated successfully' };
  }

  // ------------------------------ deleteAccount -----------------------------
  async deleteAccount(user:UserDocument){
    await this.URS.findOneAndUpdate({ email: user.email }, { isDeleted: true });
    return { msg: 'account deleted successfully' };
  }

  // ------------------------------ blockUser -----------------------------
  async blockUser(user:UserDocument,id:Types.ObjectId){
    const userExist = await this.URS.findOne({filter:{_id:id}});
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    await this.URS.findOneAndUpdate({ _id:id }, { isBlocked: true });
    return { msg: 'user blocked successfully' };
  }

  // ------------------------------ unblockUser -----------------------------
  async unblockUser(user:UserDocument,id:Types.ObjectId){
    const userExist = await this.URS.findOne({filter:{_id:id}});
    if (!userExist) {
      throw new BadRequestException('User does not exist');
    }
    await this.URS.findOneAndUpdate({ _id:id }, { isBlocked: false });
    return { msg: 'user unblocked successfully' };
  }

  // ------------------------------ updateUserRole -----------------------------
  async updateUserRole(id:Types.ObjectId){
    const user = await this.URS.findOne({filter:{_id:id,confirmed:{$exists:true},isDeleted:{$exists:false},isBlocked:{$exists:false}}});
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    user.role = rolesTypes.admin;
    await user.save();
    return { msg: 'user updated successfully' };
  }
}
