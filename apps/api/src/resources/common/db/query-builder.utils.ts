import { SelectQueryBuilder } from 'typeorm';

export class QueryBuilderUtils {
    static ilike(qb: SelectQueryBuilder<any>, alias: string, field: string, value?: string) {
        if (!value) return;
        qb.andWhere(`${alias}.${field} ILIKE :${field}`, {
            [field]: `%${value}%`,
        });
    }

    static inArray<T>(qb: SelectQueryBuilder<any>, alias: string, field: string, values?: T[]) {
        if (!values?.length) return;
        qb.andWhere(`${alias}.${field} IN (:...${field})`, {
            [field]: values,
        });
    }

    static between(qb: SelectQueryBuilder<any>, alias: string, field: string, range?: [string, string]) {
        if (!range) return;
        const [from, to] = range;
        qb.andWhere(`${alias}.${field} BETWEEN :${field}From AND :${field}To`, {
            [`${field}From`]: from,
            [`${field}To`]: to,
        });
    }
}
