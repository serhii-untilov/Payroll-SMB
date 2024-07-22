import { paymentsFindAll } from '@/services/payment.service';
import { snackbarError } from '@/utils';
import { FindAllPaymentDto, Payment, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePaymentList(params: FindAllPaymentDto) {
    const { companyId, payPeriod } = params;
    const { data, isError, error, isLoading } = useQuery<Payment[], Error>({
        queryKey: [ResourceType.Payment, params],
        queryFn: async () => {
            return companyId && payPeriod ? (await paymentsFindAll(params)) ?? [] : [];
        },
        enabled: !!(params.companyId && params.payPeriod),
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
