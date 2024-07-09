import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Accounting } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Accounting[]; isLoading: boolean };

export function useAccountingList(): Result {
    const { data, isError, isLoading, error } = useQuery<Accounting[], Error>({
        queryKey: ['accounting', 'list'],
        queryFn: async () => {
            return (await api.accountingFindAll()).data || [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
