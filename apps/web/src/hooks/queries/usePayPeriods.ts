import {
    payPeriodsFindAll,
    payPeriodsFindCurrent,
    payPeriodsFindOne,
} from '@/services/payPeriod.service';
import {
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    FindOnePayPeriodDto,
    PayPeriod,
    ResourceType,
} from '@repo/openapi';
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

export function useCurrentPayPeriod(params: FindCurrentPayPeriodDto) {
    return useQuery<PayPeriod, Error>({
        queryKey: [ResourceType.PayPeriod, { params }],
        queryFn: async () => await payPeriodsFindCurrent(params),
    });
}
