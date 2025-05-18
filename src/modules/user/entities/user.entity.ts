import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User {
    @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
    id: number;

    @ApiProperty({ example: 'johndoe', description: 'Username of the user' })
    username: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
    email: string;

    @Exclude() // This will remove the field from responses
    password: string;


    @ApiProperty({
        example: ['EMPLOYEE'],
        description: 'User roles',
        enum: Role,
        isArray: true
    })
    roles: Role[];

    @ApiProperty({ type: () => Employee, required: false, description: 'Associated employee details' })
    employee?: Employee;

    @ApiProperty({ example: true, description: 'User active status' })
    isActive: boolean;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', required: false })
    lastLogin?: Date;

    @ApiProperty({ description: 'Timestamp when the user was created' })
    createdAt: Date;

    @ApiProperty({ description: 'Timestamp when the user was last updated' })
    updatedAt: Date;
}

