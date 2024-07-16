import { personsFindOne } from '@/services/person.service';
import { snackbarError } from '@/utils/snackbar';
import { Person } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { id: number | null | undefined };
type Result = { data: Person | null | undefined; isLoading: boolean };

export function usePerson(params: Params): Result {
    const { data, isError, isLoading, error } = useQuery<Person | null, Error>({
        queryKey: [ResourceType.PERSON, params],
        queryFn: async () => {
            return params.id ? (await personsFindOne(params.id)) ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
