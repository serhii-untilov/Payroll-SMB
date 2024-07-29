import {
    positionsFindAll,
    positionsFindBalance,
    positionsFindFirstByPersonId,
    positionsFindOne,
} from '@/services/api/position.service';
import {
    FindAllPositionBalanceDto,
    FindAllPositionDto,
    FindOnePositionDto,
    FindPositionByPersonDto,
    Position,
    PositionBalanceExtendedDto,
    ResourceType,
} from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePosition(positionId: number, params?: FindOnePositionDto) {
    return useQuery<Position, Error>({
        queryKey: [ResourceType.Position, { positionId, ...params }],
        queryFn: async () => await positionsFindOne(positionId, params),
        enabled: !!positionId,
    });
}

export function usePositions(params: FindAllPositionDto) {
    return useQuery<Position[], Error>({
        queryKey: [ResourceType.Position, params],
        queryFn: async () => await positionsFindAll(params),
        enabled: !!params?.companyId,
    });
}

export function usePositionBalances(params: FindAllPositionBalanceDto) {
    return useQuery<PositionBalanceExtendedDto[], Error>({
        queryKey: [ResourceType.Position, 'balanceExtended', params],
        queryFn: async () => {
            return await positionsFindBalance(params);
        },
        enabled: !!params.companyId && !!params.payPeriod,
    });
}

export function usePositionByPerson(params: Partial<FindPositionByPersonDto>) {
    const { companyId, personId } = params;
    return useQuery<Position | null, Error>({
        queryKey: [ResourceType.Position, params],
        queryFn: async () => {
            return companyId && personId
                ? (await positionsFindFirstByPersonId({
                      ...params,
                      companyId,
                      personId,
                  })) ?? null
                : null;
        },
    });
}
