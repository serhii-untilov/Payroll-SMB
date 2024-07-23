import { paymentsFindOne } from '@/services/payment.service';
import { snackbarError } from '@/utils/snackbar';
import { FindOnePaymentDto, Payment, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePayment(paymentId: number, params?: FindOnePaymentDto) {
    const { data, isError, error, isLoading } = useQuery<Payment, Error>({
        queryKey: [ResourceType.Payment, { paymentId, ...params }],
        queryFn: async () => {
            return await paymentsFindOne(paymentId, params);
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? null, isLoading };
}
