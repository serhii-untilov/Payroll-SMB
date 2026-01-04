import 'reflect-metadata';

export const FILTER_META_KEY = Symbol('filter');

export type FilterType = 'ilike' | 'eq' | 'in' | 'between';

export interface FilterMeta {
    type: FilterType;
    field?: string;
}

export function Filter(type: FilterType, field?: string): PropertyDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata(FILTER_META_KEY, { type, field: field ?? propertyKey }, target, propertyKey);
    };
}
