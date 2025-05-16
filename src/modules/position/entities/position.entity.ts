import { ApiProperty } from '@nestjs/swagger';
// import { Employee } from '../../employees/entities/employee.entity';

export class Position {
    @ApiProperty({
        example: 1,
        description: 'Unique identifier for the position',
    })
    id: number;

    @ApiProperty({
        example: 'Senior Engineer',
        description: 'Title or designation of the position',
    })
    title: string;

    @ApiProperty({
        example: 2,
        description: 'Seniority or hierarchical level of the position (lower number = higher rank)',
    })
    level: number;

    @ApiProperty({
        example: 1,
        required: false,
        description: 'ID of the parent position, if this position is nested under another',
    })
    parentId?: number;

    @ApiProperty({
        type: () => Position,
        required: false,
        description: 'Parent position object, if any',
    })
    parent?: Position;

    @ApiProperty({
        type: () => [Position],
        required: false,
        description: 'List of child positions under this position',
    })
    children?: Position[];

    // @ApiProperty({
    //   type: () => [Employee],
    //   required: false,
    //   description: 'Employees assigned to this position',
    // })
    // employees?: Employee[];

    @ApiProperty({
        example: 'Technical leadership role',
        required: false,
        description: 'Optional description or summary of the position responsibilities',
    })
    description?: string;

    @ApiProperty({
        example: false,
        description: 'Indicates whether this is an executive-level position',
    })
    isExecutive: boolean;

    @ApiProperty({
        description: 'Date and time when the position record was created',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date and time when the position record was last updated',
    })
    updatedAt: Date;
}
