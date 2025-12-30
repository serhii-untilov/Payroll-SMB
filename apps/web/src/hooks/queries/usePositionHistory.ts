import { api } from '@/api';
import {
    CreatePositionHistoryDto,
    FindAllPositionHistoryDto,
    PositionHistory,
    Resource,
    UpdatePositionHistoryDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const usePositionHistoryList = (params: FindAllPositionHistoryDto) => {
    return useQuery<PositionHistory[], Error>({
        queryKey: [Resource.PositionHistory, params],
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
        queryKey: [Resource.PositionHistory, { ...params, last: true }],
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
                Resource.PositionHistory,
                Resource.Position,
                Resource.Payroll,
                Resource.PayFund,
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.PayPeriod,
                Resource.Company,
                Resource.Task,
            ]);
        },
    });
};

type UpdatePositionHistory = {
    id: string;
    dto: UpdatePositionHistoryDto;
};

const useUpdatePositionHistory = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePositionHistory): Promise<PositionHistory> =>
            (await api.positionHistoryUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.PositionHistory,
                Resource.Position,
                Resource.Payroll,
                Resource.PayFund,
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.PayPeriod,
                Resource.Company,
                Resource.Task,
            ]);
        },
    });
};

const useRemovePositionHistory = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.positionHistoryRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.PositionHistory,
                Resource.Position,
                Resource.Payroll,
                Resource.PayFund,
                Resource.Payment,
                Resource.PaymentPosition,
                Resource.PayPeriod,
                Resource.Company,
                Resource.Task,
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
