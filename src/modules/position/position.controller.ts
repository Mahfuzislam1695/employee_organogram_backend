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
import { PositionService } from './position.service';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AssignParentDto } from './dto/assign-parent.dto';

@ApiTags('Positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly service: PositionService) { }

  @Post()
  @ApiOperation({ summary: 'Create position' })
  @ApiResponse({ status: 201, type: Position })
  async create(
    @Body() createPositionDto: CreatePositionDto,
    @Res() res: Response,
  ) {
    try {
      const position = await this.service.create(createPositionDto);
      sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Position created successfully',
        data: position,
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
  @ApiOperation({ summary: 'List all positions with hierarchy' })
  @ApiResponse({ status: 200, type: [Position] })
  async findAll(
    @Query() pagination: PaginationParamsDto,
    // @Query() query: PositionQueryDto,
    @Res() res: Response,
  ) {
    try {
      const { positions, total } = await this.service.findAll(pagination);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Positions retrieved successfully',
        data: positions,
        meta: {
          totalItems: total,
          itemCount: positions.length,
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
  @ApiOperation({ summary: 'Get position details with hierarchy' })
  @ApiResponse({ status: 200, type: Position })
  async findOne(
    @Param('id') id: string,
    @Query() query: PositionQueryDto,
    @Res() res: Response,
  ) {
    try {
      const position = await this.service.findOne(+id, query);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Position retrieved successfully',
        data: position,
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
  @ApiOperation({ summary: 'Update position' })
  @ApiResponse({ status: 200, type: Position })
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
    @Res() res: Response,
  ) {
    try {
      const position = await this.service.update(+id, updatePositionDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Position updated successfully',
        data: position,
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
  @ApiOperation({ summary: 'Delete position' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.service.remove(+id);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Position deleted successfully',
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

  @Post(':id/parent')
  @ApiOperation({ summary: 'Assign parent position' })
  @ApiResponse({ status: 200, type: Position })
  async assignParent(
    @Param('id') id: string,
    @Body() assignParentDto: AssignParentDto,
    @Res() res: Response,
  ) {
    try {
      const position = await this.service.assignParent(+id, assignParentDto);
      sendResponse(res, {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Parent position assigned successfully',
        data: position,
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
