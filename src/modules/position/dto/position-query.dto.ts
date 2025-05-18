import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PositionQueryDto {
    @ApiPropertyOptional({
        type: Boolean,
        example: true,
        description: 'Whether to include child positions in the response',
    })
    @IsOptional()
    @IsBoolean({ message: 'includeChildren must be a boolean value' })
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    includeChildren?: boolean;

    @ApiPropertyOptional({
        type: Boolean,
        example: true,
        description: 'Whether to include employees assigned to each position',
    })
    @IsOptional()
    @IsBoolean({ message: 'includeEmployees must be a boolean value' })
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    includeEmployees?: boolean;
}
