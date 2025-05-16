import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentRepository } from './department.repository';
// import { EmployeesModule } from '../employee/employee.module';



@Module({
  imports: [],
  // imports: [EmployeesModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository, PrismaService],
  exports: [DepartmentService],
})
export class DepartmentModule { }
