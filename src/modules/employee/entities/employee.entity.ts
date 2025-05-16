import { ApiProperty } from '@nestjs/swagger';
import { Department } from 'src/modules/department/entities/department.entity';
import { Position } from 'src/modules/position/entities/position.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class Employee {
    @ApiProperty({
        example: 1,
        description: 'Unique identifier of the employee',
    })
    id: number;

    @ApiProperty({
        example: 'EMP-001',
        description: 'Custom employee code or unique HR identifier',
    })
    employeeId: string;

    @ApiProperty({
        example: 'John',
        description: 'First name of the employee',
    })
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the employee',
    })
    lastName: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the employee',
    })
    fullName: string;

    @ApiProperty({
        example: 'john.doe@company.com',
        description: 'Official email address of the employee',
    })
    email: string;

    @ApiProperty({
        example: '+1234567890',
        required: false,
        description: 'Contact phone number of the employee',
    })
    phone?: string;

    @ApiProperty({
        type: () => Position,
        description: 'Position or role assigned to the employee',
    })
    position: Position;

    @ApiProperty({
        type: () => Employee,
        required: false,
        description: 'Direct manager or supervisor of the employee',
    })
    manager?: Employee;

    @ApiProperty({
        type: () => [Employee],
        required: false,
        description: 'List of employees who report to this employee',
    })
    subordinates?: Employee[];

    @ApiProperty({
        example: '1.2.',
        description: 'Materialized path representing the employee’s position in the org tree',
    })
    path: string;

    @ApiProperty({
        example: true,
        description: 'Status flag indicating if the employee is currently active',
    })
    isActive: boolean;

    @ApiProperty({
        type: () => Department,
        required: false,
        description: 'Department where the employee works',
    })
    department?: Department;

    @ApiProperty({
        type: () => Department,
        required: false,
        description: 'If employee is head of a department, this field indicates which one',
    })
    headOfDepartment?: Department;

    @ApiProperty({
        type: () => User,
        required: false,
        description: 'Linked user account for login, if any',
    })
    user?: User;

    @ApiProperty({
        example: 2,
        description: 'Depth level in the organizational hierarchy (e.g., 1 = top)',
    })
    hierarchyLevel: number;

    @ApiProperty({
        description: 'Timestamp of when the employee record was created',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Timestamp of the last update to the employee record',
    })
    updatedAt: Date;
}
