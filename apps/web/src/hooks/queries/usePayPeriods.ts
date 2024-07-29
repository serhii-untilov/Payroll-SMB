import { payPeriodsFindAll } from '@/services/api/payPeriod.service';
import { FindAllPayPeriodDto, PayPeriod, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePayPeriods(params: FindAllPayPeriodDto) {
    return useQuery<PayPeriod[], Error>({
        queryKey: [ResourceType.PayPeriod, params],
        queryFn: async () => await payPeriodsFindAll(params),
    });
}
