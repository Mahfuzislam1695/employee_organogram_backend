import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message?: string;

    @ApiProperty()
    data: T[];

    @ApiProperty()
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}