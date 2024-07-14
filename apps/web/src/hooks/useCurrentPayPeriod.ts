import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: dto.PayPeriod | undefined | null; isLoading: boolean };

export function useCurrentPayPeriod(params: Partial<dto.FindCurrentPayPeriodDto>): Result {
    const { data, isError, isLoading, error } = useQuery<dto.PayPeriod | null, Error>({
        queryKey: [ResourceType.PAY_PERIOD, params],
        queryFn: async () => {
            return params.companyId
                ? (
                      await api.payPeriodsFindCurrent({
                          ...params,
                          companyId: params.companyId,
                      })
                  ).data ?? null
                : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
