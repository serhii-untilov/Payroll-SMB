/**
 * Wrapper type used to circumvent ESM modules circular dependency issue
 * caused by reflection metadata saving the type of the property.
 * https://docs.nestjs.com/recipes/swc#common-pitfalls
 */
export type WrapperType<T> = T; // WrapperType === Relation
