export interface QueryPolicy<TQuery> {
    canExecute(query: TQuery, userId: string, companyId?: string): Promise<boolean>;
}
