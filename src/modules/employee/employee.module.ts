import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeController } from './employee.controller';
import { PositionsModule } from '../position/position.module';
import { DepartmentModule } from '../department/department.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [DepartmentModule, PositionsModule, UserModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository, PrismaService],
  exports: [EmployeeService],
})
export class EmployeesModule { }
