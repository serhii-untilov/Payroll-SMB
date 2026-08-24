import { useQuery } from '@tanstack/react-query';

// TODO

const useGetPaymentMandatoryList = (_: { _paymentId: string }) => {
    return useQuery<any[], Error>({
        queryKey: ['Todo Mandatory Payments'],
        queryFn: () => [],
    });
};

export { useGetPaymentMandatoryList };
