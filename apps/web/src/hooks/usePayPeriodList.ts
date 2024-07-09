import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { PayPeriod } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | null | undefined; relations: boolean; fullFieldList: boolean };
type Result = { data: PayPeriod[]; isLoading: boolean };

export function usePayPeriodList(params: Params): Result {
    const companyId = Number(params.companyId);
    const { relations, fullFieldList } = params;
    const { data, isError, isLoading, error } = useQuery<PayPeriod[], Error>({
        queryKey: ['payPeriod', 'list', { companyId, relations: true, fullFieldList: true }],
        queryFn: async () => {
            return (await api.payPeriodsFindAll(companyId, relations, fullFieldList)).data;
        },
        enabled: !!companyId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data || [], isLoading };
}
