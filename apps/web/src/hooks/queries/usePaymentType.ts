import { api } from '@/api';
import { FindAllPaymentTypeDto, PaymentType, Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetPaymentTypeList = (params?: FindAllPaymentTypeDto) => {
    return useQuery<PaymentType[], Error>({
        queryKey: [Resource.PaymentType, params],
        queryFn: async () =>
            (await api.paymentTypeFindAll(params ?? {})).data.sort((a: PaymentType, b: PaymentType) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            ),
    });
};

export { useGetPaymentTypeList };
