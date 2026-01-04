import { api } from '@/api';
import {
    CreatePositionDto,
    FindAllPositionBalanceDto,
    FindAllPositionDto,
    FindOnePositionDto,
    FindPositionByPersonDto,
    Position,
    PositionBalanceExtendedDto,
    Resource,
    UpdatePositionDto,
} from '@repo/openapi';
import { MAX_SEQUENCE_NUMBER } from '@repo/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPosition = (positionId: string, params?: FindOnePositionDto) => {
    return useQuery<Position, Error>({
        queryKey: [Resource.Position, { positionId, ...params }],
        queryFn: async () => (await api.positionsFindOne(positionId, params ?? {})).data,
        enabled: !!positionId,
    });
};

const useGetPositionList = (params: FindAllPositionDto) => {
    return useQuery<Position[], Error>({
        queryKey: [Resource.Position, params],
        queryFn: async () =>
            (await api.positionsFindAll(params)).data.sort(
                (a, b) => (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) - (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
            ),
        enabled: !!params?.companyId,
    });
};

const useGetPositionBalanceList = (params: FindAllPositionBalanceDto) => {
    return useQuery<PositionBalanceExtendedDto[], Error>({
        queryKey: [Resource.Position, 'balanceExtended', params],
        queryFn: async () => {
            return (await api.positionsFindBalance(params)).data.sort(
                (a, b) => (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) - (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
            );
        },
        enabled: !!params.companyId && !!params.payPeriod,
    });
};

const useGetPositionByPerson = (params: Partial<FindPositionByPersonDto>) => {
    const { companyId, personId } = params;
    return useQuery<Position | null, Error>({
        queryKey: [Resource.Position, params],
        queryFn: async () => {
            return companyId && personId
                ? ((
                      await api.positionsFindFirstByPersonId({
                          ...params,
                          companyId,
                          personId,
                      })
                  ).data ?? null)
                : null;
        },
    });
};

const useCreatePosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePositionDto): Promise<Position> => (await api.positionsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Position, Resource.Task]);
        },
    });
};

type UpdatePosition = {
    id: string;
    dto: UpdatePositionDto;
};

const useUpdatePosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePosition): Promise<Position> => (await api.positionsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Position, Resource.Task]);
        },
    });
};

const useRemovePosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.positionsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Position, Resource.Task]);
        },
    });
};

export {
    useCreatePosition,
    useGetPosition,
    useGetPositionBalanceList,
    useGetPositionByPerson,
    useGetPositionList,
    useRemovePosition,
    useUpdatePosition,
};
