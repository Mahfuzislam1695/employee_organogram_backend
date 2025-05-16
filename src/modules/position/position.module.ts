import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { PositionRepository } from './position.repository';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [],
  // imports: [EmployeesModule],
  controllers: [PositionController],
  providers: [PositionService, PositionRepository, PrismaService],
  exports: [PositionService],
})
export class PositionsModule { }
