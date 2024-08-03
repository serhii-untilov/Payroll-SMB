import { paymentsFindAll, paymentsFindOne } from '@/services/payment.service';
import { paymentPositionsFindAll } from '@/services/paymentPosition.service';
import {
    FindAllPaymentDto,
    FindAllPaymentPositionDto,
    FindOnePaymentDto,
    Payment,
    PaymentPosition,
    ResourceType,
} from '@repo/openapi';
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

export function usePaymentPositions(params: FindAllPaymentPositionDto) {
    return useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.PaymentPosition, params],
        queryFn: async () => await paymentPositionsFindAll(params),
    });
}

export function useMandatoryPayments({ _paymentId }) {
    // TODO
    return useQuery<any[], Error>({
        queryKey: ['Todo Mandatory Payments'],
        queryFn: () => [],
    });
}
