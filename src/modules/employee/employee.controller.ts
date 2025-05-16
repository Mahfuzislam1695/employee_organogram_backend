import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { PaginationParamsDto } from '../../shared/pagination/dto/pagination-params.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { sendResponse } from '../../common/responses/send-response';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { SubordinatesQueryDto } from './dto/subordinates-query.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) { }

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({ status: 201, type: Employee })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.service.create(createEmployeeDto);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Employee created successfully',
        data: employee,
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
  @ApiOperation({ summary: 'List all employees' })
  @ApiResponse({ status: 200, type: [Employee] })
  async findAll(
    @Query() pagination: PaginationParamsDto,
    @Query() query: EmployeeQueryDto,
    @Res() res: Response,
  ) {
    try {
      const { employees, total } = await this.service.findAll(pagination, query);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Employees retrieved successfully',
        data: employees,
        meta: {
          totalItems: total,
          itemCount: employees.length,
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
  @ApiOperation({ summary: 'Get employee details' })
  @ApiResponse({ status: 200, type: Employee })
  async findOne(
    @Param('id') id: string,
    @Query() query: EmployeeQueryDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.service.findOne(+id, query);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Employee retrieved successfully',
        data: employee,
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
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({ status: 200, type: Employee })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.service.update(+id, updateEmployeeDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Employee updated successfully',
        data: employee,
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
  @ApiOperation({ summary: 'Delete employee' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.service.remove(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Employee deleted successfully',
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

  @Post(':id/manager')
  @ApiOperation({ summary: 'Assign manager to employee' })
  @ApiResponse({ status: 200, type: Employee })
  async assignManager(
    @Param('id') id: string,
    @Body() assignManagerDto: AssignManagerDto,
    @Res() res: Response,
  ) {
    try {
      const employee = await this.service.assignManager(+id, assignManagerDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Manager assigned successfully',
        data: employee,
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

  @Get(':id/subordinates')
  @ApiOperation({ summary: 'Get employee subordinates' })
  @ApiResponse({ status: 200, type: [Employee] })
  async findSubordinates(
    @Param('id') id: string,
    @Query() query: SubordinatesQueryDto,
    @Res() res: Response,
  ) {
    try {
      const subordinates = await this.service.findSubordinates(+id, query);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Subordinates retrieved successfully',
        data: subordinates,
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