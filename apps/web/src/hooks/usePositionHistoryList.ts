import { positionHistoryFindAll } from '@/services/positionHistory.service';
import { snackbarError } from '@/utils/snackbar';
import { FindAllPositionHistoryDto, PositionHistory, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePositionHistoryList(params: FindAllPositionHistoryDto) {
    const { data, isError, error, isLoading } = useQuery<PositionHistory[], Error>({
        queryKey: [ResourceType.PositionHistory, params],
        queryFn: async () => {
            return await positionHistoryFindAll(params);
        },
        enabled: !!params.positionId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
