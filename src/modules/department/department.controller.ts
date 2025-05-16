import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Res,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { PaginationParamsDto } from 'src/shared/pagination/dto/pagination-params.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { sendResponse } from 'src/common/responses/send-response';
import { DepartmentService } from './department.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AssignHeadDto } from './dto/assign-head.dto';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) { }

  @Post()
  @ApiOperation({ summary: 'Create department' })
  @ApiResponse({ status: 201, type: Department })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Res() res: Response,
  ) {
    try {
      const department = await this.service.create(createDepartmentDto);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Department created successfully',
        data: department,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all departments with pagination' })
  @ApiResponse({ status: 200, type: [Department] })
  async findAllPaginated(
    @Query() pagination: PaginationParamsDto,
    @Res() res: Response,
  ) {
    try {
      const { data, total } = await this.service.findAllPaginated(pagination);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Departments retrieved successfully',
        data,
        meta: {
          totalItems: total,
          itemCount: data.length,
          itemsPerPage: pagination.limit,
          totalPages: Math.ceil(total / pagination.limit),
          currentPage: pagination.page,
        },
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department details' })
  @ApiResponse({ status: 200, type: Department })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const department = await this.service.findOne(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Department retrieved successfully',
        data: department,
      });
    } catch (error) {
      const statusCode = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
      sendResponse(res, {
        statusCode,
        success: false,
        message: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  @ApiResponse({ status: 200, type: Department })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Res() res: Response,
  ) {
    try {
      const department = await this.service.update(+id, updateDepartmentDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Department updated successfully',
        data: department,
      });
    } catch (error) {
      const statusCode = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
      sendResponse(res, {
        statusCode,
        success: false,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.service.remove(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Department deleted successfully',
      });
    } catch (error) {
      const statusCode = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
      sendResponse(res, {
        statusCode,
        success: false,
        message: error.message,
      });
    }
  }

  @Post(':id/head')
  @ApiOperation({ summary: 'Assign department head' })
  @ApiResponse({ status: 200, type: Department })
  async assignHead(
    @Param('id') id: string,
    @Body() assignHeadDto: AssignHeadDto,
    @Res() res: Response,
  ) {
    try {
      const department = await this.service.assignHead(+id, assignHeadDto.employeeId);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Department head assigned successfully',
        data: department,
      });
    } catch (error) {
      const statusCode = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
      sendResponse(res, {
        statusCode,
        success: false,
        message: error.message,
      });
    }
  }
}