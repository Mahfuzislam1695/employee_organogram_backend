import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employee/employee.module';
import { UserController } from './user.controller';
import { RoleController } from '../role/role.controller';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [EmployeesModule],
  controllers: [UserController, RoleController],
  providers: [
    UserService,
    RoleService,
    UserRepository,
    RoleRepository,
    PrismaService,
  ],
  exports: [UserService, RoleService],
})

export class UserModule { }
