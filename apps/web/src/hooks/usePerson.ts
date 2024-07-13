import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

const resourceType = ResourceType.PERSON;
type Entity = dto.Person;
const queryFn = api.personsFindOne;

type Params = { id: number | null | undefined };
type Result = { data: Entity | undefined; isLoading: boolean };

export function usePerson(params: Params): Result {
    const { data, isError, isLoading, error } = useQuery<Entity | undefined, Error>({
        queryKey: [resourceType, params],
        queryFn: async () => {
            return params.id ? (await queryFn(params.id)).data : undefined;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
