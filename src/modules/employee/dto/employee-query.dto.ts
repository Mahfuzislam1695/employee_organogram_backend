import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class EmployeeQueryDto {
    @ApiPropertyOptional({
        example: true,
        description: 'Include manager details in the response',
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeManager?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include subordinates details in the response',
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeSubordinates?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include department details in the response',
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeDepartment?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Include position details in the response',
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includePosition?: boolean;
}