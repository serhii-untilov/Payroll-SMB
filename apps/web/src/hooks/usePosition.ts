import { positionsFindOne } from '@/services/position.service';
import { snackbarError } from '@/utils/snackbar';
import { FindOnePositionDto, Position, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePosition(positionId: number, params?: FindOnePositionDto) {
    const { data, isError, error, isLoading } = useQuery<Position, Error>({
        queryKey: [ResourceType.Position, { positionId, ...params }],
        queryFn: async () => await positionsFindOne(positionId, params),
        enabled: !!positionId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
