import { api } from '@/api';
import {
    CreatePositionDto,
    FindAllPositionBalanceDto,
    FindAllPositionDto,
    FindOnePositionDto,
    FindPositionByPersonDto,
    Position,
    PositionBalanceExtendedDto,
    ResourceType,
    UpdatePositionDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';
import { MAX_SEQUENCE_NUMBER } from '@repo/shared';

const useGetPosition = (positionId: number, params?: FindOnePositionDto) => {
    return useQuery<Position, Error>({
        queryKey: [ResourceType.Position, { positionId, ...params }],
        queryFn: async () => (await api.positionsFindOne(positionId, params ?? {})).data,
        enabled: !!positionId,
    });
};

const useGetPositionList = (params: FindAllPositionDto) => {
    return useQuery<Position[], Error>({
        queryKey: [ResourceType.Position, params],
        queryFn: async () =>
            (await api.positionsFindAll(params)).data.sort(
                (a, b) =>
                    (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) -
                    (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
            ),
        enabled: !!params?.companyId,
    });
};

const useGetPositionBalanceList = (params: FindAllPositionBalanceDto) => {
    return useQuery<PositionBalanceExtendedDto[], Error>({
        queryKey: [ResourceType.Position, 'balanceExtended', params],
        queryFn: async () => {
            return (await api.positionsFindBalance(params)).data.sort(
                (a, b) =>
                    (Number(a.cardNumber) || MAX_SEQUENCE_NUMBER) -
                    (Number(b.cardNumber) || MAX_SEQUENCE_NUMBER),
            );
        },
        enabled: !!params.companyId && !!params.payPeriod,
    });
};

const useGetPositionByPerson = (params: Partial<FindPositionByPersonDto>) => {
    const { companyId, personId } = params;
    return useQuery<Position | null, Error>({
        queryKey: [ResourceType.Position, params],
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
        mutationFn: async (dto: CreatePositionDto): Promise<Position> =>
            (await api.positionsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Position, ResourceType.Task]);
        },
    });
};

type UpdatePosition = {
    id: number;
    dto: UpdatePositionDto;
};

const useUpdatePosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePosition): Promise<Position> =>
            (await api.positionsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Position, ResourceType.Task]);
        },
    });
};

const useRemovePosition = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.positionsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Position, ResourceType.Task]);
        },
    });
};

export {
    useGetPosition,
    useGetPositionList,
    useGetPositionBalanceList,
    useGetPositionByPerson,
    useCreatePosition,
    useUpdatePosition,
    useRemovePosition,
};
