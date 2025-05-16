import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PositionRepository {
    private readonly logger = new Logger(PositionRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    private includeRelations(includeChildren = true, includeEmployees = true) {
        return {
            parent: true,
            children: includeChildren ? { include: this.includeRelations(false, false) } : false,
            employees: includeEmployees,
        };
    }

    async create(data: Prisma.PositionCreateInput) {
        try {
            return await this.prisma.position.create({
                data,
                include: this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(`Failed to create position: ${error.message}`);
            throw error;
        }
    }

    async findAll({
        includeChildren = true,
        includeEmployees = true,
        skip,
        take,
    }: {
        includeChildren?: boolean;
        includeEmployees?: boolean;
        skip?: number;
        take?: number;
    }) {
        try {
            const [positions, total] = await Promise.all([
                this.prisma.position.findMany({
                    skip,
                    take,
                    include: this.includeRelations(includeChildren, includeEmployees),
                    orderBy: { level: 'asc' },
                }),
                this.count(),
            ]);
            return { positions, total };
        } catch (error) {
            this.logger.error(`Failed to find positions: ${error.message}`);
            throw error;
        }
    }

    async findOne(id: number, includeChildren = true, includeEmployees = true) {
        try {
            return await this.prisma.position.findUnique({
                where: { id },
                include: this.includeRelations(includeChildren, includeEmployees),
            });
        } catch (error) {
            this.logger.error(`Failed to find position ${id}: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: Prisma.PositionUpdateInput) {
        try {
            return await this.prisma.position.update({
                where: { id },
                data,
                include: this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(`Failed to update position ${id}: ${error.message}`);
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.position.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to delete position ${id}: ${error.message}`);
            throw error;
        }
    }

    async assignParent(id: number, parentId: number) {
        try {
            return await this.prisma.position.update({
                where: { id },
                data: { parent: { connect: { id: parentId } } },
                include: this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(
                `Failed to assign parent ${parentId} to position ${id}: ${error.message}`,
            );
            throw error;
        }
    }

    async count(): Promise<number> {
        return this.prisma.position.count();
    }
}