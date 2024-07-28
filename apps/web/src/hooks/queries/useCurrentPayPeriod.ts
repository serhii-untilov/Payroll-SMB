import { payPeriodsFindCurrent } from '@/services/payPeriod.service';
import { FindCurrentPayPeriodDto, PayPeriod, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCurrentPayPeriod(params: Partial<FindCurrentPayPeriodDto>) {
    return useQuery<PayPeriod | null, Error>({
        queryKey: [ResourceType.PayPeriod, { params }],
        queryFn: async () => {
            return await payPeriodsFindCurrent(params);
        },
    });
}
