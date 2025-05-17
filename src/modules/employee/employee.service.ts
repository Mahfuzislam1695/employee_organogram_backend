import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDto } from '../../shared/pagination/dto/pagination-params.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { SubordinatesQueryDto } from './dto/subordinates-query.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository,
    private readonly prisma: PrismaService,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Check if employeeId already exists
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { employeeId: createEmployeeDto.employeeId }
      });

      if (existingEmployee) {
        throw new Error(`Employee with ID ${createEmployeeDto.employeeId} already exists`);
      }

      // Check if position exists
      const positionExists = await this.prisma.position.findUnique({
        where: { id: createEmployeeDto.positionId }
      });
      if (!positionExists) {
        throw new Error(`Position with ID ${createEmployeeDto.positionId} not found`);
      }

      // Check if department exists (if provided)
      if (createEmployeeDto.departmentId) {
        const departmentExists = await this.prisma.department.findUnique({
          where: { id: createEmployeeDto.departmentId }
        });
        if (!departmentExists) {
          throw new Error(`Department with ID ${createEmployeeDto.departmentId} not found`);
        }
      }

      // Check if manager exists (if provided)
      if (createEmployeeDto.managerId) {
        const managerExists = await this.prisma.employee.findUnique({
          where: { id: createEmployeeDto.managerId }
        });
        if (!managerExists) {
          throw new Error(`Manager with ID ${createEmployeeDto.managerId} not found`);
        }
      }

      // Transform DTO to Prisma input
      const employeeData: Prisma.EmployeeCreateInput = {
        employeeId: createEmployeeDto.employeeId,
        firstName: createEmployeeDto.firstName,
        lastName: createEmployeeDto.lastName,
        email: createEmployeeDto.email,
        phone: createEmployeeDto.phone,
        isActive: createEmployeeDto.isActive,
        fullName: `${createEmployeeDto.firstName} ${createEmployeeDto.lastName}`,
        position: { connect: { id: createEmployeeDto.positionId } },
        ...(createEmployeeDto.managerId && {
          manager: { connect: { id: createEmployeeDto.managerId } }
        }),
        ...(createEmployeeDto.departmentId && {
          department: { connect: { id: createEmployeeDto.departmentId } }
        }),
        path: '',
        hierarchyLevel: 1,
      };

      // Remove any undefined values
      const cleanEmployeeData = Object.fromEntries(
        Object.entries(employeeData).filter(([_, v]) => v !== undefined)
      ) as Prisma.EmployeeCreateInput;

      return await this.repository.create(cleanEmployeeData);
    } catch (error) {
      // Handle Prisma specific errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Employee with this ID already exists');
        }
      }
      throw new Error(error.message);
    }
  }

  async findAll(
    pagination: PaginationParamsDto,
    query: EmployeeQueryDto = {},
  ) {
    try {
      return await this.repository.findAll({
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          manager: query.includeManager,
          subordinates: query.includeSubordinates,
          department: query.includeDepartment,
          position: query.includePosition,
          user: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to retrieve employees: ${error.message}`);
    }
  }

  async findOne(id: number, query: EmployeeQueryDto = {}) {
    const employee = await this.repository.findOne(id, {
      manager: query.includeManager,
      subordinates: query.includeSubordinates,
      department: query.includeDepartment,
      position: query.includePosition,
      user: true,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.update(id, updateEmployeeDto);
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.remove(id);
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }

  async assignManager(id: number, assignManagerDto: AssignManagerDto) {
    await this.findOne(id); // Check employee exists
    try {
      return await this.repository.assignManager(id, assignManagerDto.managerId);
    } catch (error) {
      throw new Error(`Failed to assign manager: ${error.message}`);
    }
  }

  async findSubordinates(id: number, query: SubordinatesQueryDto = {}) {
    await this.findOne(id); // Check employee exists
    try {
      return await this.repository.findSubordinates(id, query.recursive);
    } catch (error) {
      throw new Error(`Failed to find subordinates: ${error.message}`);
    }
  }
}