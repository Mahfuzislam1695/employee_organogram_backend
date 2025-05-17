import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JWT_CONFIG, BCRYPT_SALT_ROUNDS } from './constants/auth.constants';
import { AUTH_MESSAGES } from './constants/messages.constants';
import { Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly repository: AuthRepository,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
        const existingUser = await this.repository.findUserByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException(AUTH_MESSAGES.USER_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            BCRYPT_SALT_ROUNDS,
        );

        const user = await this.repository.createUser({
            username: registerDto.username,
            email: registerDto.email,
            password: hashedPassword,
            roles: [Role.EMPLOYEE],
            ...(registerDto.employeeId && { employee: { connect: { id: registerDto.employeeId } } }),
        });

        return this.generateTokens(user);
    }

    async login(loginDto: LoginDto): Promise<TokenResponseDto> {
        const user = await this.repository.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        return this.generateTokens(user);
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Omit<TokenResponseDto, 'refreshToken'>> {
        const token = await this.repository.findTokenByRefreshToken(refreshTokenDto.refreshToken);
        if (!token || !token.user) {
            throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_INVALID);
        }

        // Invalidate the old refresh token
        await this.repository.invalidateToken(token.id);

        // Generate new tokens but only return access token
        const tokens = await this.generateTokens(token.user);
        return {
            accessToken: tokens.accessToken,
            expiresIn: tokens.expiresIn
        };
    }

    private async generateTokens(user: any): Promise<TokenResponseDto> {
        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            roles: user.roles,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: JWT_CONFIG.expiresIn,
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: JWT_CONFIG.refreshExpiresIn,
        });

        // Store the refresh token
        await this.repository.createApiToken({
            token: accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + parseInt(JWT_CONFIG.refreshExpiresIn) * 1000),
            user: { connect: { id: user.id } },
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: parseInt(JWT_CONFIG.expiresIn),
        };
    }
}