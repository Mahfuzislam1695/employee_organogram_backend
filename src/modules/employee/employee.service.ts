import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDto } from '../../shared/pagination/dto/pagination-params.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { SubordinatesQueryDto } from './dto/subordinates-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Convert DTO to Prisma input type
      const employeeData: Prisma.EmployeeCreateInput = {
        ...createEmployeeDto,
        fullName: `${createEmployeeDto.firstName} ${createEmployeeDto.lastName}`,
        position: { connect: { id: createEmployeeDto.positionId } },
        ...(createEmployeeDto.managerId && {
          manager: { connect: { id: createEmployeeDto.managerId } }
        }),
        ...(createEmployeeDto.departmentId && {
          department: { connect: { id: createEmployeeDto.departmentId } }
        }),
        path: '', // Will be updated when assigning manager
        hierarchyLevel: 1, // Default level
      };

      return await this.repository.create(employeeData);
    } catch (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
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