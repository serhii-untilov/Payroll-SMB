import { accountingFindAll } from '@/services/api/accounting.service';
import { Accounting, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useAccountingList() {
    return useQuery<Accounting[], Error>({
        queryKey: [ResourceType.Accounting],
        queryFn: async () => await accountingFindAll(),
    });
}
