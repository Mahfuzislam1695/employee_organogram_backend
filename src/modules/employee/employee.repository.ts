import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EmployeePathUtil } from './utils/employee-path.util';

@Injectable()
export class EmployeeRepository {
    private readonly logger = new Logger(EmployeeRepository.name);

    constructor(private readonly prisma: PrismaService) { }

    private includeRelations({
        includeManager = true,
        includeSubordinates = false,
        includeDepartment = true,
        includePosition = true,
    }: {
        includeManager?: boolean;
        includeSubordinates?: boolean;
        includeDepartment?: boolean;
        includePosition?: boolean;
    } = {}) {
        return {
            manager: includeManager,
            subordinates: includeSubordinates,
            department: includeDepartment,
            position: includePosition,
            user: true,
        };
    }

    async create(data: Prisma.EmployeeCreateInput) {
        try {
            return await this.prisma.employee.create({
                data,
                include: this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(`Failed to create employee: ${error.message}`);
            throw error;
        }
    }

    async findAll({
        skip,
        take,
        where,
        include,
    }: {
        skip?: number;
        take?: number;
        where?: Prisma.EmployeeWhereInput;
        include?: Prisma.EmployeeInclude;
    }) {
        try {
            const [employees, total] = await Promise.all([
                this.prisma.employee.findMany({
                    skip,
                    take,
                    where,
                    include: include || this.includeRelations(),
                    orderBy: { hierarchyLevel: 'asc' },
                }),
                this.prisma.employee.count({ where }),
            ]);
            return { employees, total };
        } catch (error) {
            this.logger.error(`Failed to find employees: ${error.message}`);
            throw error;
        }
    }

    async findOne(
        id: number,
        include?: Prisma.EmployeeInclude,
    ) {
        try {
            return await this.prisma.employee.findUnique({
                where: { id },
                include: include || this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(`Failed to find employee ${id}: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: Prisma.EmployeeUpdateInput) {
        try {
            return await this.prisma.employee.update({
                where: { id },
                data,
                include: this.includeRelations(),
            });
        } catch (error) {
            this.logger.error(`Failed to update employee ${id}: ${error.message}`);
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.employee.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to delete employee ${id}: ${error.message}`);
            throw error;
        }
    }

    async assignManager(id: number, managerId: number) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const manager = await tx.employee.findUnique({
                    where: { id: managerId },
                });

                if (!manager) {
                    throw new Error(`Manager with ID ${managerId} not found`);
                }

                const newPath = EmployeePathUtil.calculatePath(manager.path, managerId);
                const hierarchyLevel = EmployeePathUtil.calculateHierarchyLevel(newPath);

                return tx.employee.update({
                    where: { id },
                    data: {
                        manager: { connect: { id: managerId } },
                        path: newPath,
                        hierarchyLevel,
                    },
                    include: this.includeRelations(),
                });
            });
        } catch (error) {
            this.logger.error(
                `Failed to assign manager ${managerId} to employee ${id}: ${error.message}`,
            );
            throw error;
        }
    }

    async findSubordinates(id: number, recursive = true) {
        try {
            const employee = await this.prisma.employee.findUnique({
                where: { id },
                select: { path: true },
            });

            if (!employee) {
                throw new Error(`Employee with ID ${id} not found`);
            }

            const pathCondition = recursive
                ? { startsWith: `${employee.path}${id}.` }
                : { equals: `${employee.path}${id}.` };

            return this.prisma.employee.findMany({
                where: {
                    path: pathCondition,
                    isActive: true,
                },
                include: this.includeRelations({ includeManager: false }),
            });
        } catch (error) {
            this.logger.error(
                `Failed to find subordinates for employee ${id}: ${error.message}`,
            );
            throw error;
        }
    }
}