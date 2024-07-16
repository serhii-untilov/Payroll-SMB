import { dto } from '@/api';
import { payPeriodsFindCurrent } from '@/services/payPeriod.service';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: dto.PayPeriod | undefined | null; isLoading: boolean };

export function useCurrentPayPeriod(params: Partial<dto.FindCurrentPayPeriodDto>): Result {
    const { data, isError, isLoading, error } = useQuery<dto.PayPeriod | null, Error>({
        queryKey: [ResourceType.PAY_PERIOD, params],
        queryFn: async () => {
            return params.companyId
                ? (await payPeriodsFindCurrent({
                      ...params,
                      companyId: params.companyId,
                  })) ?? null
                : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
