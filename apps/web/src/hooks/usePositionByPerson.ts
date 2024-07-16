import { positionsFindFirstByPersonId } from '@/services/position.service';
import { snackbarError } from '@/utils/snackbar';
import { FindPositionByPersonDto, Position } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { position: Position | null | undefined; isLoading: boolean };

export function usePositionByPerson(params: Partial<FindPositionByPersonDto>): Result {
    const {
        data: position,
        isError,
        isLoading,
        error,
    } = useQuery<Position | null, Error>({
        queryKey: [ResourceType.POSITION, params],
        queryFn: async () => {
            return params.companyId && params.personId
                ? (await positionsFindFirstByPersonId({
                      ...params,
                      companyId: params.companyId,
                      personId: params.personId,
                  })) ?? null
                : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { position, isLoading };
}
