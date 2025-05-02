import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../service/token';
import { UserRepositoryService } from 'src/DB/Repository/user.repository.service';
import { tokenTypes } from '../Types/types';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly URS: UserRepositoryService,
    private TS: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const [prefix, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token || !prefix) {
      throw new UnauthorizedException('token not found');
    }
    let secret: string | undefined = undefined;
    if (
      prefix == process.env.ADMIN &&
      request.headers.type == tokenTypes.access
    ) {
      secret = process.env.ACCESS_TOKEN_SIGNTURE_ADMIN;
    } else if (
      prefix == process.env.ADMIN &&
      request.headers.type == tokenTypes.refresh
    ) {
      secret = process.env.REFRESH_TOKEN_SIGNTURE_ADMIN;
    } else if (
      prefix == process.env.USER &&
      request.headers.type == tokenTypes.access
    ) {
      secret = process.env.ACCESS_TOKEN_SIGNTURE_USER;
    } else if (
      prefix == process.env.USER &&
      request.headers.type == tokenTypes.refresh
    ) {
      secret = process.env.REFRESH_TOKEN_SIGNTURE_USER;
    } else {
      throw new BadRequestException('invalid token prefix');
    }
    try {
      const payload = this.TS.verifyToken(token, {
        secret,
      });
      const user = await this.URS.findOne({ filter: { email: payload.email,confirmed:{$exists:true},isBlocked:{$exists:false},isDeleted:{$exists:false} } });
      if (!user) throw new ForbiddenException();
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
