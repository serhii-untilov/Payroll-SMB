export type AuditDiff<T> = Partial<{
    [K in keyof T]?: {
        before: T[K];
        after: T[K];
    };
}>;
