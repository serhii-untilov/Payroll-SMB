import { positionsFindFirstByPersonId } from '@/services/position.service';
import { snackbarError } from '@/utils/snackbar';
import { FindPositionByPersonDto, Position } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { position: Position | null | undefined; isLoading: boolean };

export function usePositionByPerson(params: Partial<FindPositionByPersonDto>): Result {
    const { companyId, personId } = params;
    const {
        data: position,
        isError,
        isLoading,
        error,
    } = useQuery<Position | null, Error>({
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
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { position, isLoading };
}
