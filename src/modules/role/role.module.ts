import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PrismaService],
  exports: [RoleService],
})
export class RoleModule { }
