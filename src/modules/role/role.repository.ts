import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository {
    private readonly logger = new Logger(RoleRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    private includeRelations = {
        users: true,
    };

    async create(data: Prisma.RoleCreateInput) {
        try {
            return await this.prisma.role.create({
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`);
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.prisma.role.findMany({
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find roles: ${error.message}`);
            throw error;
        }
    }

    async findById(id: number) {
        try {
            return await this.prisma.role.findUnique({
                where: { id },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find role ${id}: ${error.message}`);
            throw error;
        }
    }

    async findByName(name: string) {
        try {
            return await this.prisma.role.findUnique({
                where: { name },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find role by name: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: Prisma.RoleUpdateInput) {
        try {
            return await this.prisma.role.update({
                where: { id },
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to update role ${id}: ${error.message}`);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await this.prisma.role.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to delete role ${id}: ${error.message}`);
            throw error;
        }
    }
}