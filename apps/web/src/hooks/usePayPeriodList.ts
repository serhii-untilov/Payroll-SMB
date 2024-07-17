import { payPeriodsFindAll } from '@/services/payPeriod.service';
import { snackbarError } from '@/utils/snackbar';
import { FindAllPayPeriodDto, PayPeriod } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: PayPeriod[]; isLoading: boolean };

export function usePayPeriodList(params: Partial<FindAllPayPeriodDto>): Result {
    const companyId = Number(params.companyId);
    const { data, isError, isLoading, error } = useQuery<PayPeriod[], Error>({
        queryKey: [ResourceType.PAY_PERIOD, { ...params, companyId }],
        queryFn: async () => {
            return params?.companyId ? await payPeriodsFindAll({ ...params, companyId }) : [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
