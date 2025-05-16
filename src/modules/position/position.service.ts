import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationParamsDto } from '../../shared/pagination/dto/pagination-params.dto';
import { PositionRepository } from './position.repository';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AssignParentDto } from './dto/assign-parent.dto';

@Injectable()
export class PositionService {
  constructor(private readonly repository: PositionRepository) { }

  async create(createPositionDto: CreatePositionDto) {
    try {
      return await this.repository.create(createPositionDto);
    } catch (error) {
      throw new Error(`Failed to create position: ${error.message}`);
    }
  }

  async findAll(
    pagination: PaginationParamsDto,
    query: PositionQueryDto = {},
  ) {
    try {
      return await this.repository.findAll({
        includeChildren: query.includeChildren,
        includeEmployees: query.includeEmployees,
        skip: pagination.skip,
        take: pagination.limit,
      });
    } catch (error) {
      throw new Error(`Failed to retrieve positions: ${error.message}`);
    }
  }

  async findOne(id: number, query: PositionQueryDto = {}) {
    const position = await this.repository.findOne(
      id,
      query.includeChildren,
      query.includeEmployees,
    );
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.update(id, updatePositionDto);
    } catch (error) {
      throw new Error(`Failed to update position: ${error.message}`);
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Check existence
    try {
      return await this.repository.remove(id);
    } catch (error) {
      throw new Error(`Failed to delete position: ${error.message}`);
    }
  }

  async assignParent(id: number, assignParentDto: AssignParentDto) {
    await this.findOne(id); // Check position exists
    try {
      return await this.repository.assignParent(id, assignParentDto.parentId);
    } catch (error) {
      throw new Error(`Failed to assign parent: ${error.message}`);
    }
  }
}
