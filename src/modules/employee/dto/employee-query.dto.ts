import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class EmployeeQueryDto {
    @ApiPropertyOptional({
        example: true,
        description: 'Include manager details in the response',
    })
    @IsBoolean()
    @IsOptional()
    includeManager?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include subordinates details in the response',
    })
    @IsBoolean()
    @IsOptional()
    includeSubordinates?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include department details in the response',
    })
    @IsBoolean()
    @IsOptional()
    includeDepartment?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include position details in the response',
    })
    @IsBoolean()
    @IsOptional()
    includePosition?: boolean;
}
