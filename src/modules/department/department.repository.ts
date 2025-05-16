import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationParamsDto } from 'src/shared/pagination/dto/pagination-params.dto';

@Injectable()
export class DepartmentRepository {
    private readonly logger = new Logger(DepartmentRepository.name);
    private readonly includeRelations = {
        head: true,
        employees: {
            include: {
                position: true,
            },
        },
    };

    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.DepartmentCreateInput) {
        try {
            return await this.prisma.department.create({
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to create department: ${error.message}`);
            throw error;
        }
    }

    async findAllPaginated({ skip, limit }: PaginationParamsDto) {
        try {
            const [data, total] = await Promise.all([
                this.prisma.department.findMany({
                    skip,
                    take: limit,
                    include: this.includeRelations,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.department.count(),
            ]);
            return { data, total };
        } catch (error) {
            this.logger.error(`Failed to find departments: ${error.message}`);
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            return await this.prisma.department.findUnique({
                where: { id },
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to find department ${id}: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: Prisma.DepartmentUpdateInput) {
        try {
            return await this.prisma.department.update({
                where: { id },
                data,
                include: this.includeRelations,
            });
        } catch (error) {
            this.logger.error(`Failed to update department ${id}: ${error.message}`);
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.department.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to delete department ${id}: ${error.message}`);
            throw error;
        }
    }

    async assignHead(departmentId: number, employeeId: number) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.department.updateMany({
                    where: { headId: employeeId },
                    data: { headId: null },
                });
                return tx.department.update({
                    where: { id: departmentId },
                    data: { head: { connect: { id: employeeId } } },
                    include: this.includeRelations,
                });
            });
        } catch (error) {
            this.logger.error(
                `Failed to assign head ${employeeId} to department ${departmentId}: ${error.message}`,
            );
            throw error;
        }
    }

    async count(): Promise<number> {
        return this.prisma.department.count();
    }
}