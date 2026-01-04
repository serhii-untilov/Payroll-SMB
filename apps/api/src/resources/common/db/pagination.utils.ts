import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PageDto } from '../dto';

export interface PaginationMeta {
    page: number;
    limit: number;
    offset: number;
}

export class PaginationUtils {
    static readonly DEFAULT_PAGE = 1;
    static readonly DEFAULT_LIMIT = 20;
    static readonly MAX_LIMIT = 100;

    static apply<TEntity extends ObjectLiteral>(qb: SelectQueryBuilder<TEntity>, page?: PageDto): PaginationMeta {
        const pageNumber = Math.max(page?.page ?? this.DEFAULT_PAGE, 1);

        const limit = Math.min(Math.max(page?.limit ?? this.DEFAULT_LIMIT, 1), this.MAX_LIMIT);

        const offset = (pageNumber - 1) * limit;

        qb.take(limit).skip(offset);

        return { page: pageNumber, limit, offset };
    }
}
