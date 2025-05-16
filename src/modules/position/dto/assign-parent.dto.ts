import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignParentDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the parent position to be assigned',
    })
    @IsInt({ message: 'parentId must be an integer.' })
    parentId: number;
}
