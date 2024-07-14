import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { position: dto.Position | null | undefined; isLoading: boolean };

export function usePositionByPerson(params: Partial<dto.FindPositionByPersonDto>): Result {
    const {
        data: position,
        isError,
        isLoading,
        error,
    } = useQuery<dto.Position | null, Error>({
        queryKey: [ResourceType.POSITION, params],
        queryFn: async () => {
            return params.companyId && params.personId
                ? (
                      await api.positionsFindFirstByPersonId({
                          ...params,
                          companyId: params.companyId,
                          personId: params.personId,
                      })
                  ).data ?? null
                : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { position, isLoading };
}
