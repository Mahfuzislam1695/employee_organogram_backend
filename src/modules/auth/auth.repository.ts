import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
    private readonly logger = new Logger(AuthRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: Prisma.UserCreateInput) {
        try {
            return await this.prisma.user.create({ data });
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw error;
        }
    }

    async findUserByEmail(email: string) {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
                include: { employee: true }
            });
        } catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`);
            throw error;
        }
    }

    async createApiToken(data: Prisma.ApiTokenCreateInput) {
        try {
            return await this.prisma.apiToken.create({ data });
        } catch (error) {
            this.logger.error(`Failed to create API token: ${error.message}`);
            throw error;
        }
    }

    async findTokenByRefreshToken(refreshToken: string) {
        try {
            return await this.prisma.apiToken.findFirst({
                where: { refreshToken, isActive: true },
                include: { user: true }
            });
        } catch (error) {
            this.logger.error(`Failed to find token by refresh token: ${error.message}`);
            throw error;
        }
    }

    async invalidateToken(id: number) {
        try {
            return await this.prisma.apiToken.update({
                where: { id },
                data: { isActive: false }
            });
        } catch (error) {
            this.logger.error(`Failed to invalidate token: ${error.message}`);
            throw error;
        }
    }
}