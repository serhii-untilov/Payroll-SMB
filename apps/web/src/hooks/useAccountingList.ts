import { ResourceType } from '@repo/shared';
import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Accounting } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Accounting[]; isLoading: boolean };

export function useAccountingList(): Result {
    const { data, isError, isLoading, error } = useQuery<Accounting[], Error>({
        queryKey: [ResourceType.ACCOUNTING],
        queryFn: async () => {
            const response = (await api.accountingFindAll()).data || [];
            return response.sort((a: Accounting, b: Accounting) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
