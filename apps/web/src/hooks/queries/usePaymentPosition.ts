import { api } from '@/api';
import {
    CreatePaymentPositionDto,
    FindAllPaymentPositionDto,
    FindOnePaymentPositionDto,
    PaymentPosition,
    ResourceType,
    UpdatePaymentPositionDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPaymentPosition = (id: number, params?: FindOnePaymentPositionDto) => {
    return useQuery<PaymentPosition, Error>({
        queryKey: [ResourceType.PaymentPosition, { id, ...params }],
        queryFn: async () => (await api.paymentPositionsFindOne(id, params ?? {})).data,
        enabled: !!id,
    });
};

const useGetPaymentPositionList = (params: FindAllPaymentPositionDto) => {
    return useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.PaymentPosition, params],
        queryFn: async () => (await api.paymentPositionsFindAll(params)).data,
        enabled: !!params.paymentId,
    });
};

const useCreatePaymentPosition = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePaymentPositionDto): Promise<PaymentPosition> =>
            (await api.paymentPositionsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.PaymentPosition, ResourceType.Payment]);
        },
    });
};

type UpdatePaymentPosition = {
    id: number;
    dto: UpdatePaymentPositionDto;
};

const useUpdatePaymentPosition = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePaymentPosition): Promise<PaymentPosition> =>
            (await api.paymentPositionsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.PaymentPosition, ResourceType.Payment]);
        },
    });
};

const useRemovePaymentPosition = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.paymentPositionsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.PaymentPosition, ResourceType.Payment]);
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
