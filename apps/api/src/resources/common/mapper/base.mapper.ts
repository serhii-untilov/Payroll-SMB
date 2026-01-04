export abstract class BaseMapper<TEntity, TReadDto, TUpdateDto, TListItemDto = Partial<TReadDto>> {
    diff(before: TEntity, dto: TReadDto): Partial<Record<keyof TReadDto, { before: unknown; after: unknown }>> {
        const diff: Partial<Record<keyof TReadDto, { before: unknown; after: unknown }>> = {};

        for (const key of Object.keys(dto as any) as (keyof TReadDto)[]) {
            const after = dto[key];
            if (after === undefined) continue;

            const beforeValue = (before as any)[key];

            // strict equality is OK for primitives
            if (Object.is(beforeValue, after)) continue;

            diff[key] = {
                before: beforeValue,
                after,
            };
        }

        return diff;
    }

    updateEntity(entity: TEntity, dto: TUpdateDto): TEntity {
        for (const key of Object.keys(dto as any) as (keyof TUpdateDto)[]) {
            const value = dto[key];
            if (value !== undefined) {
                (entity as any)[key] = value;
            }
        }
        return entity;
    }

    toPartial(dto: TUpdateDto): Partial<TEntity> {
        const partial: Partial<TEntity> = {};

        for (const key of Object.keys(dto as any) as (keyof TUpdateDto)[]) {
            const value = dto[key];
            if (value !== undefined) {
                (partial as any)[key] = value;
            }
        }

        return partial;
    }

    abstract toReadDto(entity: TEntity): TReadDto;

    abstract toListItemDto(entity: TEntity): TListItemDto;
}
