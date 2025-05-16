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
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { sendResponse } from '../../common/responses/send-response';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) { }

  @Post()
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, type: Role })
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    try {
      const role = await this.service.create(createRoleDto);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Role created successfully',
        data: role,
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
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({ status: 200, type: [Role] })
  async findAll(@Res() res: Response) {
    try {
      const roles = await this.service.findAll();
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
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
  @ApiOperation({ summary: 'Get role details' })
  @ApiResponse({ status: 200, type: Role })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const role = await this.service.findOne(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Role retrieved successfully',
        data: role,
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
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: Role })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ) {
    try {
      const role = await this.service.update(+id, updateRoleDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Role updated successfully',
        data: role,
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
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.service.remove(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Role deleted successfully',
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
