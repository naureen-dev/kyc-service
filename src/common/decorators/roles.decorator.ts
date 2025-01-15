import { SetMetadata } from '@nestjs/common';
import { user_role } from '../../database/enums/user.enum';

export const ROLES_KEY = 'role';  // Use 'role' instead of 'roles'
export const Roles = (role: user_role) => SetMetadata(ROLES_KEY, role);
