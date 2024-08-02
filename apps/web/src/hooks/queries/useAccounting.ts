import { accountingFindAll } from '@/services/api/accounting.service';
import { Accounting, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function queryKey() {
    return [ResourceType.Accounting];
}

export function useAccountingList() {
    return useQuery<Accounting[], Error>({
        queryKey: queryKey(),
        queryFn: async () => await accountingFindAll(),
    });
}
