
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesTypes } from '../Types/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<rolesTypes[]>(ROLES_KEY,context.getHandler());
    if (!requiredRoles.length) {
      throw new BadRequestException("roles not found");
    }
    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user.role)) {
        throw new BadRequestException("unauthorized");
    }
    return true;
  }
}
