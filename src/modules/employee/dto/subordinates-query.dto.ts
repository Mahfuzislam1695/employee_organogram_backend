import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class SubordinatesQueryDto {
    @ApiPropertyOptional({
        example: true,
        description: 'Whether to recursively include all levels of subordinates',
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    recursive?: boolean = true;

    @ApiPropertyOptional({
        example: true,
        description: 'Include position details of the subordinates',
    })
    @IsBoolean()
    @IsOptional()
    includePosition?: boolean;
}
