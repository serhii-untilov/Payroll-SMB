import { personsFindOne } from '@/services/person.service';
import { snackbarError } from '@/utils/snackbar';
import { Person } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { person: Person | undefined; isLoading: boolean };

export function usePerson(id: number): Result {
    const { data, isError, isLoading, error } = useQuery<Person, Error>({
        queryKey: [ResourceType.Person, { id }],
        queryFn: async () => {
            return await personsFindOne(id);
        },
        enabled: !!id,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { person: data, isLoading };
}
