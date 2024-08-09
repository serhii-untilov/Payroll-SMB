import { api } from '@/api';
import {
    CreatePaymentDto,
    FindAllPaymentDto,
    FindOnePaymentDto,
    Payment,
    ResourceType,
    UpdatePaymentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPayment = (paymentId: number, params?: FindOnePaymentDto) => {
    return useQuery<Payment, Error>({
        queryKey: [ResourceType.Payment, { paymentId, ...params }],
        queryFn: async () => (await api.paymentsFindOne(paymentId, params ?? {})).data,
        enabled: !!paymentId,
    });
};

const useGetPaymentList = (params: FindAllPaymentDto) => {
    return useQuery<Payment[], Error>({
        queryKey: [ResourceType.Payment, params],
        queryFn: async () => (await api.paymentsFindAll(params)).data,
        enabled: !!(params.companyId && params.payPeriod),
    });
};

const useCreatePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePaymentDto): Promise<Payment> =>
            (await api.paymentsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Payment, ResourceType.Task]);
        },
    });
};

type UpdatePayment = {
    id: number;
    dto: UpdatePaymentDto;
};

const useUpdatePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> =>
            (await api.paymentsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Payment, ResourceType.Task]);
        },
    });
};

const useRemovePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.paymentsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Payment, ResourceType.Task]);
        },
    });
};

const useRestorePayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number): Promise<Payment> => (await api.paymentsRestore(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Payment, ResourceType.Task]);
        },
    });
};

const useProcessPayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> =>
            (await api.paymentsProcess(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Payment,
                ResourceType.PaymentPosition,
                ResourceType.Payroll,
                ResourceType.PayPeriod,
                ResourceType.Task,
            ]);
        },
    });
};

const useWithdrawPayment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePayment): Promise<Payment> =>
            (await api.paymentsWithdraw(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Payment,
                ResourceType.PaymentPosition,
                ResourceType.Payroll,
                ResourceType.PayPeriod,
                ResourceType.Task,
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
