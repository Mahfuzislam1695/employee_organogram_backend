import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParamsDto {
    @ApiProperty({
        required: false,
        description: 'Page number (1-based)',
        example: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page? = 1;

    @ApiProperty({
        required: false,
        description: 'Items per page',
        example: 10,
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Min(1)
    limit? = 10;

    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}