import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({
        example: 'EMP-001',
        description: 'Unique employee code used for internal tracking',
    })
    @IsString()
    employeeId: string;

    @ApiProperty({
        example: 'John',
        description: 'First name of the employee',
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the employee',
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        example: 'john.doe@company.com',
        description: 'Official email address of the employee',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '+1234567890',
        required: false,
        description: 'Optional contact phone number of the employee',
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({
        example: 1,
        description: 'Position ID assigned to the employee',
    })
    @IsInt()
    positionId: number;

    @ApiProperty({
        example: 1,
        required: false,
        description: 'Manager ID if this employee reports to another',
    })
    @IsInt()
    @IsOptional()
    managerId?: number;

    @ApiProperty({
        example: 1,
        required: false,
        description: 'Department ID to which the employee belongs',
    })
    @IsInt()
    @IsOptional()
    departmentId?: number;

    @ApiProperty({
        example: true,
        default: true,
        description: 'Flag indicating if the employee is currently active',
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
