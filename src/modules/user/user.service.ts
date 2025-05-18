import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
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
      roles: createUserDto.roles || ['EMPLOYEE'],
      ...(createUserDto.employeeId && {
        employee: { connect: { id: createUserDto.employeeId } }
      }),
    };

    try {
      return await this.repository.create(userData);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await this.repository.findAll();
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error(`Failed to retrieve users: ${error.message}`);
    }
  }

  async findOne(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Verify user exists

    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      ...(updateUserDto.password && {
        password: await bcrypt.hash(updateUserDto.password, 10)
      }),
      ...(updateUserDto.roles && { roles: updateUserDto.roles }),
    };

    try {
      return await this.repository.update(id, data);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
}
