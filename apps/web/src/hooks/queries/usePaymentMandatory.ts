import { useQuery } from '@tanstack/react-query';

// TODO

const useGetPaymentMandatoryList = ({ _paymentId }) => {
    return useQuery<any[], Error>({
        queryKey: ['Todo Mandatory Payments'],
        queryFn: () => [],
    });
};

export { useGetPaymentMandatoryList };
