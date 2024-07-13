import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

const resourceType = ResourceType.POSITION;
type Entity = dto.Position;
const queryFn = api.positionsFindFirstByPersonId;
type Params = dto.FindPositionByPersonDto;

type Result = { data: Entity | undefined; isLoading: boolean };

export function usePositionByPerson(params: Partial<Params>): Result {
    const { data, isError, isLoading, error } = useQuery<Entity | undefined, Error>({
        queryKey: [resourceType, params],
        queryFn: async () => {
            return params.companyId && params.personId
                ? (
                      await queryFn({
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
