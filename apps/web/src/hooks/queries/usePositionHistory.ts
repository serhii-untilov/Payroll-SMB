import {
    positionHistoryFindAll,
    positionHistoryFindLast,
} from '@/services/api/positionHistory.service';
import { FindAllPositionHistoryDto, PositionHistory, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePositionHistoryList(params: FindAllPositionHistoryDto) {
    return useQuery<PositionHistory[], Error>({
        queryKey: [ResourceType.PositionHistory, params],
        queryFn: async () => {
            return await positionHistoryFindAll(params);
        },
        enabled: !!params.positionId,
    });
}

export function usePositionHistoryLast(params: FindAllPositionHistoryDto) {
    return useQuery<PositionHistory, Error>({
        queryKey: [ResourceType.PositionHistory, { ...params, last: true }],
        queryFn: async () => {
            return await positionHistoryFindLast({ ...params, last: true });
        },
        enabled: !!params.positionId,
    });
}
