import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || '';

    // skip interceptor if the module is upload
    if (path.startsWith('/api/v1/upload/image')) {
      return next.handle(); // Bypass the interceptor
    }

    return next.handle().pipe(
      catchError(err => {
        if (err instanceof HttpException) {
          // If the response is an HttpException, return the error details
          const response = err.getResponse();
          const status = err.getStatus();
          return throwError(() => new HttpException({ 
            error: true, 
            code: status,
            message: response ,
            data: null,
          }, status));
        }

        // Handle uncaught errors here
        return throwError(err);
      }),
      map(data => ({
        error: false,
        code: 200,
        message: data.message || 'success',
        data: data.data,
        pagination: data.pagination
      })),
    );
  }

  static createErrorResponse(exception: HttpException, message: string) {
    const response = exception.getResponse();
    const status = exception.getStatus();

    let errorMessage = message;

    return {
      error: true,
      code: status,
      message: errorMessage,
      data: null,
    };
  }
}
