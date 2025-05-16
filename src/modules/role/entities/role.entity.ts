import { ApiProperty } from '@nestjs/swagger';

export class Role {
    @ApiProperty({ example: 1, description: 'Unique identifier for the role' })
    id: number;

    @ApiProperty({ example: 'admin', description: 'Name of the role' })
    name: string;

    @ApiProperty({ example: 'Administrator role', required: false, description: 'Description of the role' })
    description?: string;

    @ApiProperty({ type: Object, required: false, description: 'Permissions associated with the role as key-value pairs' })
    permissions?: Record<string, any>;

    @ApiProperty({ description: 'Timestamp when the role was created' })
    createdAt: Date;

    @ApiProperty({ description: 'Timestamp when the role was last updated' })
    updatedAt: Date;
}

