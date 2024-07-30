import { payPeriodsFindAll, payPeriodsFindOne } from '@/services/api/payPeriod.service';
import { FindAllPayPeriodDto, FindOnePayPeriodDto, PayPeriod, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePayPeriods(params: FindAllPayPeriodDto) {
    return useQuery<PayPeriod[], Error>({
        queryKey: [ResourceType.PayPeriod, params],
        queryFn: async () => await payPeriodsFindAll(params),
    });
}

export function usePayPeriod(id: number, options: FindOnePayPeriodDto) {
    return useQuery<PayPeriod, Error>({
        queryKey: [ResourceType.PayPeriod, { id, ...options }],
        queryFn: async () => await payPeriodsFindOne(id, options),
    });
}
