import { api } from '@/api';
import {
    CreatePaymentDto,
    FindAllPaymentDto,
    Payment,
    ProcessPaymentDto,
    Resource,
    UpdatePaymentDto,
    WithdrawPaymentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPayment = (paymentId: string, params?: Record<string, unknown>) => {
    return useQuery<Payment, Error>({
        queryKey: [Resource.Payment, { paymentId, ...params }],
        queryFn: async () => (await api.paymentsFindOne(paymentId, params ?? {})).data,
        enabled: !!paymentId,
    });
};

const useGetPaymentList = (params: FindAllPaymentDto) => {
    return useQuery<Payment[], Error>({
        queryKey: [Resource.Payment, params],
        queryFn: async () => (await api.paymentsFindAll(params)).data,
        enabled: !!(params.companyId && params.payPeriod),
    });
};

const useCreatePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePaymentDto): Promise<Payment> => (await api.paymentsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

type UpdatePayment = {
    id: string;
    version: number;
    dto: UpdatePaymentDto;
};

type VersionedPayment = {
    id: string;
    version: number;
};

const useUpdatePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdatePayment): Promise<Payment> =>
            (await api.paymentsUpdate(id, version, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useRemovePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedPayment) => (await api.paymentsRemove(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useRestorePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedPayment): Promise<Payment> =>
            (await api.paymentsRestore(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useProcessPayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedPayment): Promise<Payment> =>
            (await api.paymentsProcess(id, { version } as ProcessPaymentDto)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.Payroll,
                Resource.PayPeriod,
                Resource.Task,
            ]);
        },
    });
};

const useWithdrawPayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedPayment): Promise<Payment> =>
            (await api.paymentsWithdraw(id, { version } as WithdrawPaymentDto)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.Payroll,
                Resource.PayPeriod,
                Resource.Task,
            ]);
        },
    });
};

export {
    useGetPayment,
    useGetPaymentList,
    useCreatePayment,
    useUpdatePayment,
    useRemovePayment,
    useRestorePayment,
    useProcessPayment,
    useWithdrawPayment,
};
