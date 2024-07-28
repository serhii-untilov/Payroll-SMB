import { paymentsFindAll, paymentsFindOne } from '@/services/payment.service';
import { FindAllPaymentDto, FindOnePaymentDto, Payment, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePayment(paymentId: number, params?: FindOnePaymentDto) {
    return useQuery<Payment, Error>({
        queryKey: [ResourceType.Payment, { paymentId, ...params }],
        queryFn: async () => {
            return await paymentsFindOne(paymentId, params);
        },
    });
}

export function usePayments(params: FindAllPaymentDto) {
    const { companyId, payPeriod } = params;
    return useQuery<Payment[], Error>({
        queryKey: [ResourceType.Payment, params],
        queryFn: async () => {
            return companyId && payPeriod ? (await paymentsFindAll(params)) ?? [] : [];
        },
        enabled: !!(params.companyId && params.payPeriod),
    });
}
