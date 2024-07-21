import { accountingFindAll } from '@/services/accounting.service';
import { snackbarError } from '@/utils/snackbar';
import { Accounting } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Accounting[]; isLoading: boolean };

export function useAccountingList(): Result {
    const { data, isError, isLoading, error } = useQuery<Accounting[], Error>({
        queryKey: [ResourceType.Accounting],
        queryFn: async () => await accountingFindAll(),
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
