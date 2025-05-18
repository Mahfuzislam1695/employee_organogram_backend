import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SubordinatesQueryDto {
    @ApiPropertyOptional({
        example: true,
        description: 'Whether to recursively include all levels of subordinates',
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true') // Convert string to boolean
    recursive?: boolean = true;

    @ApiPropertyOptional({
        example: true,
        description: 'Include position details of the subordinates',
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true') // Convert string to boolean
    includePosition?: boolean;
}
