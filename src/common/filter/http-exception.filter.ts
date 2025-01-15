import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ApiResponseInterceptor } from 'src/common/interceptors/api-response.interceptor';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Get the validation error message
    const exceptionError = exception.getResponse() as any;
    let message;

    if (exceptionError.message) {
      if (exceptionError.message.message) {
          message = exceptionError.message.message[0]; // Display only the first error
        } else {
            message = exceptionError.message;
        }
      } else {
          // Handle the case when exceptionError.message is undefined or null
          message = "Something went wrong";
      }
    
    // Customize the error response
    const errorResponse = ApiResponseInterceptor.createErrorResponse(exception, message);

    response.status(errorResponse.code).json(errorResponse);
  }
}
