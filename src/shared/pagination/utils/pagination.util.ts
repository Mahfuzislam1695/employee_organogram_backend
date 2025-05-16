import { PaginationParamsDto } from '../dto/pagination-params.dto';

export function paginate<T>(
    data: T[],
    totalItems: number,
    pagination: PaginationParamsDto,
) {
    return {
        data,
        meta: {
            totalItems,
            itemCount: data.length,
            itemsPerPage: pagination.limit,
            totalPages: Math.ceil(totalItems / pagination.limit),
            currentPage: pagination.page,
        },
    };
}