import { api } from '@/api';
import {
    CreatePositionHistoryDto,
    FindAllPositionHistoryDto,
    PositionHistory,
    ResourceType,
    UpdatePositionHistoryDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const usePositionHistoryList = (params: FindAllPositionHistoryDto) => {
    return useQuery<PositionHistory[], Error>({
        queryKey: [ResourceType.PositionHistory, params],
        queryFn: async () => {
            return (await api.positionHistoryFindAll(params)).data.sort(
                (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
            );
        },
        enabled: !!params.positionId,
    });
};

const usePositionHistoryLast = (params: FindAllPositionHistoryDto) => {
    return useQuery<PositionHistory, Error>({
        queryKey: [ResourceType.PositionHistory, { ...params, last: true }],
        queryFn: async () => {
            return (await api.positionHistoryFindLast({ ...params, last: true })).data;
        },
        enabled: !!params.positionId,
    });
};

const useCreatePositionHistory = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePositionHistoryDto): Promise<PositionHistory> =>
            (await api.positionHistoryCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.PositionHistory,
                ResourceType.Position,
                ResourceType.Payroll,
                ResourceType.PayFund,
                ResourceType.Payment,
                ResourceType.PaymentPosition,
                ResourceType.PayPeriod,
                ResourceType.Company,
                ResourceType.Task,
            ]);
        },
    });
};

type UpdatePositionHistory = {
    id: number;
    dto: UpdatePositionHistoryDto;
};

const useUpdatePositionHistory = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePositionHistory): Promise<PositionHistory> =>
            (await api.positionHistoryUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.PositionHistory,
                ResourceType.Position,
                ResourceType.Payroll,
                ResourceType.PayFund,
                ResourceType.Payment,
                ResourceType.PaymentPosition,
                ResourceType.PayPeriod,
                ResourceType.Company,
                ResourceType.Task,
            ]);
        },
    });
};

const useRemovePositionHistory = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.positionHistoryRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.PositionHistory,
                ResourceType.Position,
                ResourceType.Payroll,
                ResourceType.PayFund,
                ResourceType.Payment,
                ResourceType.PaymentPosition,
                ResourceType.PayPeriod,
                ResourceType.Company,
                ResourceType.Task,
            ]);
        },
    });
};

export {
    useCreatePositionHistory,
    usePositionHistoryLast,
    usePositionHistoryList,
    useRemovePositionHistory,
    useUpdatePositionHistory,
};
