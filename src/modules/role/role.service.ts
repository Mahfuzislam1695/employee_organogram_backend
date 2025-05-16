import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) { }

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.repository.create(createRoleDto);
    } catch (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new Error(`Failed to retrieve roles: ${error.message}`);
    }
  }

  async findOne(id: number) {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string) {
    const role = await this.repository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // Verify role exists
    try {
      return await this.repository.update(id, updateRoleDto);
    } catch (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Verify role exists
    try {
      return await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  }
}
