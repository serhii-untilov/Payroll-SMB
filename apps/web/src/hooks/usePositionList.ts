import { positionsFindAll } from '@/services/position.service';
import { snackbarError } from '@/utils/snackbar';
import { FindAllPositionDto, Position, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePositionList(params: FindAllPositionDto) {
    const { data, isError, error, isLoading } = useQuery<Position[], Error>({
        queryKey: [ResourceType.Position, params],
        queryFn: async () => await positionsFindAll(params),
        enabled: !!params?.companyId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
