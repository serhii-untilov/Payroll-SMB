import { positionHistoryFindLast } from '@/services/positionHistory.service';
import { snackbarError } from '@/utils';
import { FindAllPositionHistoryDto, PositionHistory, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePositionHistoryLast(params: FindAllPositionHistoryDto) {
    const { data, isError, error, isLoading } = useQuery<PositionHistory, Error>({
        queryKey: [ResourceType.PositionHistory, { ...params, last: true }],
        queryFn: async () => {
            return await positionHistoryFindLast({ ...params, last: true });
        },
        enabled: !!params.positionId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
