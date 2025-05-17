import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_MESSAGES } from './constants/messages.constants';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { sendResponse } from '../../common/responses/send-response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: AUTH_MESSAGES.REGISTER_SUCCESS, type: TokenResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: AUTH_MESSAGES.USER_EXISTS })
    async register(
        @Body() registerDto: RegisterDto,
        @Res() res: Response
    ) {
        try {
            const tokens = await this.authService.register(registerDto);
            sendResponse(res, {
                statusCode: HttpStatus.CREATED,
                success: true,
                message: AUTH_MESSAGES.REGISTER_SUCCESS,
                data: tokens,
            });
        } catch (error) {
            const statusCode = error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
            sendResponse(res, {
                statusCode,
                success: false,
                message: error.message,
            });
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: AUTH_MESSAGES.LOGIN_SUCCESS, type: TokenResponseDto })
    @ApiResponse({ status: 401, description: AUTH_MESSAGES.INVALID_CREDENTIALS })
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response
    ) {
        try {
            const tokens = await this.authService.login(loginDto);
            sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: AUTH_MESSAGES.LOGIN_SUCCESS,
                data: tokens,
            });
        } catch (error) {
            const statusCode = error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
            sendResponse(res, {
                statusCode,
                success: false,
                message: error.message,
            });
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: AUTH_MESSAGES.REFRESH_SUCCESS, type: TokenResponseDto })
    @ApiResponse({ status: 401, description: AUTH_MESSAGES.TOKEN_INVALID })
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Res() res: Response
    ) {
        try {
            const tokens = await this.authService.refreshToken(refreshTokenDto);
            sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: AUTH_MESSAGES.REFRESH_SUCCESS,
                data: tokens,
            });
        } catch (error) {
            const statusCode = error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
            sendResponse(res, {
                statusCode,
                success: false,
                message: error.message,
            });
        }
    }

    // @Post('logout')
    // @UseGuards(JwtAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Logout and invalidate tokens' })
    // @ApiResponse({ status: 200, description: AUTH_MESSAGES.LOGOUT_SUCCESS })
    // @ApiResponse({ status: 401, description: AUTH_MESSAGES.UNAUTHORIZED })
    // async logout(
    //     @Req() req,
    //     @Res() res: Response
    // ) {
    //     try {
    //         await this.authService.logout(req.user.sub);
    //         sendResponse(res, {
    //             statusCode: HttpStatus.OK,
    //             success: true,
    //             message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    //         });
    //     } catch (error) {
    //         const statusCode = error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    //         sendResponse(res, {
    //             statusCode,
    //             success: false,
    //             message: error.message,
    //         });
    //     }
    // }
}