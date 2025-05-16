import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AssignRoleDto {
    @ApiProperty({
        example: [1, 2],
        type: [Number],
        description: 'Array of role IDs to assign to the user',
    })
    @IsArray()
    @IsInt({ each: true })
    roleIds: number[];
}
