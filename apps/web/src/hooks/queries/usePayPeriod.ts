import { api } from '@/api';
import {
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    FindOnePayPeriodDto,
    PayPeriod,
    Resource,
    UpdatePayPeriodDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPayPeriodList = (params: FindAllPayPeriodDto) => {
    return useQuery<PayPeriod[], Error>({
        queryKey: [Resource.PayPeriod, 'all', params],
        queryFn: async () =>
            (await api.payPeriodsFindAll(params)).data.sort(
                (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
            ),
    });
};

const useGetPayPeriod = (id: string, options: FindOnePayPeriodDto) => {
    return useQuery<PayPeriod, Error>({
        queryKey: [Resource.PayPeriod, 'one', { id, ...options }],
        queryFn: async () => (await api.payPeriodsFindOne(id, options)).data,
    });
};

const useGetCurrentPayPeriod = (params: FindCurrentPayPeriodDto) => {
    return useQuery<PayPeriod, Error>({
        queryKey: [Resource.PayPeriod, 'current', { params }],
        queryFn: async () => (await api.payPeriodsFindCurrent(params)).data,
    });
};

type UpdatePayPeriod = {
    id: string;
    dto: UpdatePayPeriodDto;
};

const useClosePayPeriod = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayPeriod): Promise<PayPeriod> =>
            (await api.payPeriodsClose(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.PayPeriod,
                Resource.Payroll,
                Resource.Position,
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.Company,
                Resource.Task,
            ]);
        },
    });
};

const useOpenPayPeriod = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayPeriod): Promise<PayPeriod> =>
            (await api.payPeriodsOpen(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.PayPeriod,
                Resource.Payroll,
                Resource.Position,
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.Company,
                Resource.Task,
            ]);
        },
    });
};

export {
    useGetPayPeriod,
    useGetPayPeriodList,
    useGetCurrentPayPeriod,
    useClosePayPeriod,
    useOpenPayPeriod,
};
