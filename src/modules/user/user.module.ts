import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employee/employee.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [EmployeesModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PrismaService,
  ],
  exports: [UserService],
})

export class UserModule { }
