import { paymentTypesFindAll } from '@/services/paymentType.service';
import { FindAllPaymentTypeDto, PaymentType, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePaymentTypes(params?: FindAllPaymentTypeDto) {
    return useQuery<PaymentType[], Error>({
        queryKey: [ResourceType.PaymentType, params],
        queryFn: async () => await paymentTypesFindAll(params),
    });
}
