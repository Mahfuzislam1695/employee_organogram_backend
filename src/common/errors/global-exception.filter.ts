import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { ApiError } from './api-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof ApiError) {
            // Handle custom API errors
            statusCode = exception.statusCode;
            message = exception.message;

        } else if (exception instanceof BadRequestException) {
            // Handle validation errors from DTOs
            const responseBody = exception.getResponse();
            statusCode = HttpStatus.BAD_REQUEST;

            if (typeof responseBody === 'object' && responseBody['message']) {
                message = Array.isArray(responseBody['message'])
                    ? responseBody['message'].join(', ')
                    : responseBody['message'];
            } else {
                message = 'Bad request';
            }

        } else if (exception instanceof UnauthorizedException) {
            // Handle missing or invalid JWT tokens
            statusCode = HttpStatus.UNAUTHORIZED;
            message = exception.message || 'Unauthorized access';

        } else if (exception instanceof HttpException) {
            // Generic NestJS HTTP errors
            statusCode = exception.getStatus();
            const responseBody = exception.getResponse();

            message = typeof responseBody === 'string'
                ? responseBody
                : (responseBody as any)?.message || exception.message;
        }

        response.status(statusCode).json({
            statusCode,
            success: false,
            message,
        });
    }
}


// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpStatus,
//     BadRequestException,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { ApiError } from './api-error';
// import { ValidationError } from 'class-validator';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//     catch(exception: unknown, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();

//         let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
//         let message = 'Internal server error';

//         if (exception instanceof ApiError) {
//             // Handle custom API errors
//             statusCode = exception.statusCode;
//             message = exception.message;
//         } else if (exception instanceof BadRequestException) {
//             // Handle validation errors
//             const validationErrors = exception.getResponse();
//             if (
//                 Array.isArray(validationErrors['message']) &&
//                 validationErrors['message'][0] instanceof ValidationError
//             ) {
//                 statusCode = HttpStatus.BAD_REQUEST;
//                 message = validationErrors['message']
//                     .map((err: ValidationError) => Object.values(err.constraints).join(', '))
//                     .join(', ');
//             } else {
//                 statusCode = HttpStatus.BAD_REQUEST;
//                 message = validationErrors['message'] || 'Validation failed';
//             }
//         }

//         // Send the response
//         response.status(statusCode).json({
//             statusCode,
//             success: false,
//             message,
//         });
//     }
// }