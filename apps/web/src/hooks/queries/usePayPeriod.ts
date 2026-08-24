import { api } from '@/api';
import {
    ClosePayPeriodDto,
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    OpenPayPeriodDto,
    PayPeriod,
    Resource,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPayPeriodList = (params: FindAllPayPeriodDto) => {
    return useQuery<PayPeriod[], Error>({
        queryKey: [Resource.PayPeriod, 'all', params],
        queryFn: async () =>
            (await api.payPeriodFindAll(params)).data.sort((a: PayPeriod, b: PayPeriod) => a.dateFrom.getTime() - b.dateFrom.getTime()),
    });
};

const useGetPayPeriod = (id: string, options?: Record<string, unknown>) => {
    return useQuery<PayPeriod, Error>({
        queryKey: [Resource.PayPeriod, 'one', { id, ...options }],
        queryFn: async () => (await api.payPeriodFindOne(id, options)).data,
    });
};

const useGetCurrentPayPeriod = (params: FindCurrentPayPeriodDto) => {
    return useQuery<PayPeriod, Error>({
        queryKey: [Resource.PayPeriod, 'current', { params }],
        queryFn: async () => (await api.payPeriodFindCurrent(params)).data,
    });
};

type VersionedPayPeriod = {
    id: string;
    version: number;
};

const useClosePayPeriod = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedPayPeriod): Promise<PayPeriod> =>
            (await api.payPeriodClose(id, version, { version } as ClosePayPeriodDto)).data,
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
        mutationFn: async ({ id, version }: VersionedPayPeriod): Promise<PayPeriod> =>
            (await api.payPeriodOpen(id, version, { version } as OpenPayPeriodDto)).data,
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

export { useGetPayPeriod, useGetPayPeriodList, useGetCurrentPayPeriod, useClosePayPeriod, useOpenPayPeriod };
