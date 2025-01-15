import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {

    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }

    return user; 
  }
}
