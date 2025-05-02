import { SetMetadata } from '@nestjs/common';
import { rolesTypes } from '../Types/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: rolesTypes[]) => SetMetadata(ROLES_KEY, roles);
