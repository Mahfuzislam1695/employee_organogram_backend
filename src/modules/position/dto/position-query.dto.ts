import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class PositionQueryDto {
    @ApiPropertyOptional({
        example: true,
        description: 'Whether to include child positions in the response',
    })
    @IsBoolean({ message: 'includeChildren must be a boolean value.' })
    @IsOptional()
    includeChildren?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether to include employees assigned to each position',
    })
    @IsBoolean({ message: 'includeEmployees must be a boolean value.' })
    @IsOptional()
    includeEmployees?: boolean;
}
