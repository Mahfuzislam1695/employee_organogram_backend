import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignHeadDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    employeeId: number;
}