import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { SortingDto } from '../dto';

export class SortingUtils {
    static apply<TEntity extends ObjectLiteral>(
        qb: SelectQueryBuilder<TEntity>,
        alias: string,
        sorting: SortingDto | undefined,
        allowedFields: readonly (keyof TEntity)[],
        defaultSorting: { field: keyof TEntity; order: 'ASC' | 'DESC' },
    ) {
        const field = sorting?.field;

        if (field && allowedFields.includes(field as keyof TEntity)) {
            qb.addOrderBy(`${alias}.${field}`, sorting!.order);
            return;
        }

        qb.addOrderBy(`${alias}.${String(defaultSorting.field)}`, defaultSorting.order);
    }
}
