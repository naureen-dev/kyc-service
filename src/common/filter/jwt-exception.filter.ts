import { Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response; // Cast to express.Response
    const message = 'Access Denied'; 

    response.status(401).json({
      error: true,
      code: 401,
      message: message,
      data: null,
    });
  }
}
