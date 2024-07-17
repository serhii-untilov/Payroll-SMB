import { payPeriodsFindCurrent } from '@/services/payPeriod.service';
import { snackbarError } from '@/utils/snackbar';
import { FindCurrentPayPeriodDto, PayPeriod } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: PayPeriod | undefined | null; isLoading: boolean };

export function useCurrentPayPeriod(params: Partial<FindCurrentPayPeriodDto>): Result {
    const { companyId } = params;
    const { data, isError, isLoading, error } = useQuery<PayPeriod | null, Error>({
        queryKey: [ResourceType.PAY_PERIOD, { params }],
        queryFn: async () => {
            return companyId ? (await payPeriodsFindCurrent(params)) ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
