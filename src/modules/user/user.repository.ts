import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    private includeRelations = {
        employee: true,
        roles: true,
    };

    async create(data: Prisma.UserCreateInput) {
        try {
            return await this.prisma.user.create({
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.prisma.user.findMany({
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to retrieve users: ${error.message}`);
            throw error;
        }
    }

    //     async findAll(pagination?: { skip?: number; take?: number }) {
    //   try {
    //     return await this.prisma.user.findMany({
    //       skip: pagination?.skip,
    //       take: pagination?.take,
    //       include: this.includeRelations,
    //     });
    //   } catch (error) {
    //     this.logger.error(`Failed to retrieve users: ${error.message}`);
    //     throw error;
    //   }
    // }

    async findById(id: number) {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find user ${id}: ${error.message}`);
            throw error;
        }
    }

    async findByEmail(email: string) {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to update user ${id}: ${error.message}`);
            throw error;
        }
    }

    async assignRoles(userId: number, roleIds: number[]) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: {
                    roles: {
                        set: roleIds.map(id => ({ id })),
                    },
                },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to assign roles: ${error.message}`);
            throw error;
        }
    }
}