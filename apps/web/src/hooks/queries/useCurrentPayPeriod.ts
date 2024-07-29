import { payPeriodsFindCurrent } from '@/services/api/payPeriod.service';
import { FindCurrentPayPeriodDto, PayPeriod, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCurrentPayPeriod(params: FindCurrentPayPeriodDto) {
    return useQuery<PayPeriod, Error>({
        queryKey: [ResourceType.PayPeriod, { params }],
        queryFn: async () => await payPeriodsFindCurrent(params),
    });
}
