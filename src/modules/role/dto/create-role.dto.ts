import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({
        example: 'admin',
        description: 'Unique name of the role (e.g., admin, manager, viewer)',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Administrator role',
        required: false,
        description: 'Optional description of the role’s purpose',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: { users: ['read', 'write'], settings: ['update'] },
        required: false,
        description: 'Object defining permissions as resource-action mappings',
    })
    @IsObject()
    @IsOptional()
    permissions?: Record<string, any>;
}
