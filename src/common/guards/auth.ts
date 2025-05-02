
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './authentication';
import { RolesGuard } from './authorization';
import { rolesTypes } from '../Types/types';

export function Auth(...roles: rolesTypes[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
