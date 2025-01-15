import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { user_role } from '../../database/enums/user.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<user_role>(ROLES_KEY, context.getHandler()); 

    if (!requiredRole) {
      return true; // If no role is specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    // Check if user's role matches the required role
    return user?.role === requiredRole;
  }
}
