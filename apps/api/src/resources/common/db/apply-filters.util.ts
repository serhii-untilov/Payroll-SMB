import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { FILTER_META_KEY, FilterMeta } from './filter.decorators';

export class ApplyFiltersUtil {
    static apply<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, alias: string, dto?: object) {
        if (!dto) return;

        for (const key of Object.keys(dto)) {
            const value = (dto as any)[key];
            if (value === undefined || value === null) continue;

            const meta: FilterMeta | undefined = Reflect.getMetadata(FILTER_META_KEY, dto, key);

            if (!meta) continue;

            const field = meta.field as string;

            switch (meta.type) {
                case 'ilike':
                    qb.andWhere(`${alias}.${field} ILIKE :${key}`, {
                        [key]: `%${value}%`,
                    });
                    break;

                case 'eq':
                    qb.andWhere(`${alias}.${field} = :${key}`, { [key]: value });
                    break;

                case 'in':
                    qb.andWhere(`${alias}.${field} IN (:...${key})`, {
                        [key]: value,
                    });
                    break;

                case 'between':
                    qb.andWhere(`${alias}.${field} BETWEEN :${key}From AND :${key}To`, {
                        [`${key}From`]: value[0],
                        [`${key}To`]: value[1],
                    });
                    break;
            }
        }
    }
}
