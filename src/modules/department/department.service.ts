import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDto } from 'src/shared/pagination/dto/pagination-params.dto';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly repository: DepartmentRepository) { }

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.repository.create(createDepartmentDto);
    } catch (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }
  }

  async findAllPaginated(pagination: PaginationParamsDto) {
    try {
      return await this.repository.findAllPaginated(pagination);
    } catch (error) {
      throw new Error(`Failed to retrieve departments: ${error.message}`);
    }
  }

  async findOne(id: number) {
    const department = await this.repository.findOne(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.update(id, updateDepartmentDto);
    } catch (error) {
      throw new Error(`Failed to update department: ${error.message}`);
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.remove(id);
    } catch (error) {
      throw new Error(`Failed to delete department: ${error.message}`);
    }
  }

  async assignHead(id: number, employeeId: number) {
    await this.findOne(id); // Check department exists
    try {
      return await this.repository.assignHead(id, employeeId);
    } catch (error) {
      throw new Error(`Failed to assign department head: ${error.message}`);
    }
  }
}