export abstract class BaseMapper<TEntity, TReadDto, TCreateDto, TUpdateDto, TListItemDto = Partial<TReadDto>> {
    protected constructor(protected readonly EntityClass: new () => TEntity) {}

    toEntity(dto: TCreateDto | TUpdateDto): TEntity {
        const entity = new this.EntityClass();
        Object.assign(entity as any, dto);
        return entity;
    }

    diff(
        before: TEntity,
        dto: TReadDto | TUpdateDto,
    ): Partial<Record<keyof TReadDto, { before: unknown; after: unknown }>> {
        const diff: Partial<Record<keyof TReadDto, { before: unknown; after: unknown }>> = {};

        for (const key of Object.keys(dto as any) as (keyof TReadDto)[]) {
            const after = (dto as any)[key];
            if (after === undefined) continue;

            const beforeValue = (before as any)[key];
            if (Object.is(beforeValue, after)) continue;

            diff[key] = { before: beforeValue, after };
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
