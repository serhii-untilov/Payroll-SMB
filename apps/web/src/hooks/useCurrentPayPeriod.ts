import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: dto.PayPeriod | undefined; isLoading: boolean };

export function useCurrentPayPeriod(params: Partial<dto.FindCurrentPayPeriodDto>): Result {
    const { data, isError, isLoading, error } = useQuery<dto.PayPeriod | undefined, Error>({
        queryKey: [ResourceType.PAY_PERIOD, params],
        queryFn: async () => {
            return params.companyId
                ? (
                      await api.payPeriodsFindCurrent({
                          ...params,
                          companyId: params.companyId,
                      })
                  ).data
                : undefined;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
