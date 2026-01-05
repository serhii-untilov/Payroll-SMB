import { SelectQueryBuilder } from 'typeorm';
import { SortingDto } from '../dto';

export class SortingUtils {
    static apply(
        qb: SelectQueryBuilder<any>,
        sorting: SortingDto | undefined,
        sortableMap: Record<string, string>,
        defaultSort: { field: string; order: 'ASC' | 'DESC' },
    ): void {
        const field = sorting?.field ?? defaultSort.field;
        const order = sorting?.order ?? defaultSort.order;

        const column = sortableMap[field];
        if (!column) return;

        qb.orderBy(column, order);
    }
}
