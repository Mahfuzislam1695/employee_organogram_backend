import { ApiProperty } from '@nestjs/swagger';
// import { Employee } from './employee.entity'; // Update the path accordingly

export class Department {
    @ApiProperty({
        example: 1,
        description: 'Unique identifier of the Web Development department',
    })
    id: number;

    @ApiProperty({
        example: 'Web Development',
        description: 'Name of the department responsible for web-based applications',
    })
    name: string;

    @ApiProperty({
        example: 'WEBDEV',
        description: 'Short code representing the Web Development department',
    })
    code: string;

    @ApiProperty({
        example: 'Responsible for frontend, backend, and full-stack web solutions',
        description: 'Detailed description of the Web Development department',
        required: false,
        nullable: true,
    })
    description?: string;

    //   @ApiProperty({
    //     type: () => Employee,
    //     description: 'Department head overseeing all web projects',
    //     required: false,
    //     nullable: true,
    //   })
    //   head?: Employee;

    @ApiProperty({
        example: '2025-01-10T09:15:00Z',
        description: 'Timestamp when the department was created',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-05-15T16:45:00Z',
        description: 'Timestamp of the last update to the department record',
    })
    updatedAt: Date;
}
