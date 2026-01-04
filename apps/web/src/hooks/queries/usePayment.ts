import { api } from '@/api';
import {
    CreatePaymentDto,
    FindAllPaymentDto,
    FindOnePaymentDto,
    Payment,
    Resource,
    UpdatePaymentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPayment = (paymentId: string, params?: FindOnePaymentDto) => {
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
    dto: UpdatePaymentDto;
};

const useUpdatePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> => (await api.paymentsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useRemovePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.paymentsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useRestorePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string): Promise<Payment> => (await api.paymentsRestore(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Payment, Resource.Task]);
        },
    });
};

const useProcessPayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> => (await api.paymentsProcess(id, dto)).data,
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
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> => (await api.paymentsWithdraw(id, dto)).data,
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
