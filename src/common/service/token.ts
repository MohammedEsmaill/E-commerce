import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService
    ) {}
    generateToken(payload: any,options:JwtSignOptions):string {
        return this.jwtService.sign(payload,options);
    }
    verifyToken(token: string,options:JwtVerifyOptions):JwtPayload{
        return this.jwtService.verify(token,options);
    }
}