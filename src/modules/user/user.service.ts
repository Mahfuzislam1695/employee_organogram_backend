import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData: Prisma.UserCreateInput = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      isActive: createUserDto.isActive,
      ...(createUserDto.employeeId && {
        employee: { connect: { id: createUserDto.employeeId } }
      }),
    };

    try {
      return await this.repository.create(userData);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  }


  async findOne(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Verify user exists

    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      ...(updateUserDto.password && {
        password: await bcrypt.hash(updateUserDto.password, 10)
      }),
    };

    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async assignRoles(id: number, assignRoleDto: AssignRoleDto) {
    await this.findOne(id); // Verify user exists
    try {
      return await this.repository.assignRoles(id, assignRoleDto.roleIds);
    } catch (error) {
      throw new Error(`Failed to assign roles: ${error.message}`);
    }
  }
}
