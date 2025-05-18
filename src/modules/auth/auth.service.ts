import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { employee: true },
        });
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles,
        };

        return {
            accessToken: this.jwtService.sign(payload, {
                secret: jwtConstants.accessSecret,
                expiresIn: jwtConstants.accessTokenExpiresIn,
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: jwtConstants.refreshSecret,
                expiresIn: jwtConstants.refreshTokenExpiresIn,
            }),
        };
    }

    async refreshToken(dto: RefreshTokenDto) {
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET, // separate secret for refresh token
            });

            // You can do more checks here (e.g., check if user still exists or token is revoked)

            const newAccessToken = this.jwtService.sign(
                { sub: payload.sub, role: payload.role },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '15m',
                },
            );

            return {
                accessToken: newAccessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
