import { PrismaService } from '../../prisma/prisma.service';
import { PaginationParamsDto } from './dto/pagination-params.dto';

export abstract class BaseRepository<T> {
    constructor(protected prisma: PrismaService) { }

    abstract model(): any;

    async findAllPaginated(
        pagination: PaginationParamsDto,
        include?: any,
        where?: any,
    ) {
        const [data, total] = await Promise.all([
            this.model().findMany({
                skip: pagination.skip,
                take: pagination.limit,
                include,
                where,
            }),
            this.model().count({ where }),
        ]);

        return { data, total };
    }
}