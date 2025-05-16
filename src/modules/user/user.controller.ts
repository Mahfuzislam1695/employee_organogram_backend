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
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.service.create(createUserDto);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: user,
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
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, type: [User] })
  async findAll(@Res() res: Response) {
    try {
      const users = await this.service.findAll();
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: users,
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
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({ status: 200, type: User })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.service.findOne(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: user,
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
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.service.update(+id, updateUserDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: user,
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

  @Post(':id/roles')
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiResponse({ status: 200, type: User })
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.service.assignRoles(+id, assignRoleDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Roles assigned successfully',
        data: user,
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