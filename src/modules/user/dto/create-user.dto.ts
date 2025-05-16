import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsBoolean, IsInt } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe', description: 'Unique username for the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Minimum 8 characters' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({ example: 1, description: 'Associated employee ID (if applicable)' })
    @IsInt()
    @IsOptional()
    employeeId?: number;

    @ApiPropertyOptional({ example: true, default: true, description: 'Whether the user is active' })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
