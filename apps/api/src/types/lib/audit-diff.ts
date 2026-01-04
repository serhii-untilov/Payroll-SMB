export type AuditDiff<T> = {
    [K in keyof T]?: {
        before: T[K];
        after: T[K];
    };
};
