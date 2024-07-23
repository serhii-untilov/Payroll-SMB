import { paymentPositionsFindAll } from '@/services/paymentPosition.service';
import { snackbarError } from '@/utils/snackbar';
import { FindAllPaymentPositionDto, PaymentPosition, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: PaymentPosition[]; isLoading: boolean };

export function usePaymentPositionList(params: FindAllPaymentPositionDto): Result {
    const { data, isError, error, isLoading } = useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.PaymentPosition, params],
        queryFn: async () => {
            return await paymentPositionsFindAll(params);
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
