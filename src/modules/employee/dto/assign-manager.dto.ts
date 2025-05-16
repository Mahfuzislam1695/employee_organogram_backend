import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignManagerDto {
    @ApiProperty({
        example: 1,
        description: 'ID of the manager to assign to an employee',
    })
    @IsInt()
    managerId: number;
}
