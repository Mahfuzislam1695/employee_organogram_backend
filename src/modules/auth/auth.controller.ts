import {
    Controller,
    Post,
    Body,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { sendResponse } from '../../common/responses/send-response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login with email/username and password' })
    @ApiResponse({
        status: 200,
        description: 'Login successful, returns access and refresh tokens',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
    })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const result = await this.authService.login(loginDto);
            sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            sendResponse(res, {
                statusCode: HttpStatus.UNAUTHORIZED,
                success: false,
                message: error.message,
            });
        }
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Get new access token from refresh token' })
    @ApiResponse({
        status: 200,
        description: 'New access token issued',
    })
    @ApiBody({ type: RefreshTokenDto })
    async refresh(@Body() dto: RefreshTokenDto, @Res() res: Response) {
        try {
            const token = await this.authService.refreshToken(dto);
            sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Access token refreshed successfully',
                data: token,
            });
        } catch (error) {
            sendResponse(res, {
                statusCode: HttpStatus.UNAUTHORIZED,
                success: false,
                message: error.message,
            });
        }
    }
}


