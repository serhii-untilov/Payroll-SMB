import { api } from '@/api';
import {
    CreatePaymentPositionDto,
    FindAllPaymentPositionDto,
    FindOnePaymentPositionDto,
    PaymentPosition,
    Resource,
    UpdatePaymentPositionDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPaymentPosition = (id: string, params?: FindOnePaymentPositionDto) => {
    return useQuery<PaymentPosition, Error>({
        queryKey: [Resource.PaymentPosition, { id, ...params }],
        queryFn: async () => (await api.paymentPositionFindOne(id, params ?? {})).data,
        enabled: !!id,
    });
};

const useGetPaymentPositionList = (params: FindAllPaymentPositionDto) => {
    return useQuery<PaymentPosition[], Error>({
        queryKey: [Resource.PaymentPosition, params],
        queryFn: async () => (await api.paymentPositionFindAll(params)).data,
        enabled: !!params.paymentId,
    });
};

const useCreatePaymentPosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePaymentPositionDto): Promise<PaymentPosition> =>
            (await api.paymentPositionCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.PaymentPosition, Resource.Payment]);
        },
    });
};

type UpdatePaymentPosition = {
    id: string;
    version: number;
    dto: UpdatePaymentPositionDto;
};

type RemovePaymentPosition = {
    id: string;
    version: number;
};

const useUpdatePaymentPosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdatePaymentPosition): Promise<PaymentPosition> =>
            (await api.paymentPositionUpdate(id, version, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.PaymentPosition, Resource.Payment]);
        },
    });
};

const useRemovePaymentPosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemovePaymentPosition) =>
            (await api.paymentPositionRemove(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.PaymentPosition, Resource.Payment]);
        },
    });
};

export {
    useGetPaymentPosition,
    useGetPaymentPositionList,
    useCreatePaymentPosition,
    useUpdatePaymentPosition,
    useRemovePaymentPosition,
};
