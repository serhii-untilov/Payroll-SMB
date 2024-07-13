import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: dto.Position | undefined; isLoading: boolean };

export function usePositionByPerson(params: Partial<dto.FindPositionByPersonDto>): Result {
    const { data, isError, isLoading, error } = useQuery<dto.Position | undefined, Error>({
        queryKey: [ResourceType.POSITION, params],
        queryFn: async () => {
            return params.companyId && params.personId
                ? (
                      await api.positionsFindFirstByPersonId({
                          ...params,
                          companyId: params.companyId,
                          personId: params.personId,
                      })
                  ).data
                : undefined;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
