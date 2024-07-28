import { paymentsFindAll, paymentsFindOne } from '@/services/payment.service';
import { FindAllPaymentDto, FindOnePaymentDto, Payment, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePayment(paymentId: number, params?: FindOnePaymentDto) {
    return useQuery<Payment, Error>({
        queryKey: [ResourceType.Payment, { paymentId, ...params }],
        queryFn: async () => await paymentsFindOne(paymentId, params),
    });
}

export function usePayments(params: FindAllPaymentDto) {
    return useQuery<Payment[], Error>({
        queryKey: [ResourceType.Payment, params],
        queryFn: async () => await paymentsFindAll(params),
        enabled: !!(params.companyId && params.payPeriod),
    });
}
