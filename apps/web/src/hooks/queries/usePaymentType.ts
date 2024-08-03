import { api } from '@/api';
import { FindAllPaymentTypeDto, PaymentType, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetPaymentTypeList = (params?: FindAllPaymentTypeDto) => {
    return useQuery<PaymentType[], Error>({
        queryKey: [ResourceType.PaymentType, params],
        queryFn: async () =>
            (await api.paymentTypesFindAll(params ?? {})).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            ),
    });
};

export { useGetPaymentTypeList };
