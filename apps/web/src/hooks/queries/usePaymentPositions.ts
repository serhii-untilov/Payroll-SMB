import { paymentPositionsFindAll } from '@/services/paymentPosition.service';
import { FindAllPaymentPositionDto, PaymentPosition, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePaymentPositions(params: FindAllPaymentPositionDto) {
    return useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.PaymentPosition, params],
        queryFn: async () => {
            return await paymentPositionsFindAll(params);
        },
    });
}
