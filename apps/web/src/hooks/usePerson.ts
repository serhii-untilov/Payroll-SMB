import { personsFindOne } from '@/services/person.service';
import { snackbarError } from '@/utils/snackbar';
import { Person } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { person: Person | null; isLoading: boolean };

export function usePerson(id: number | null | undefined): Result {
    const { data, isError, isLoading, error } = useQuery<Person | null, Error>({
        queryKey: [ResourceType.Person, { id }],
        queryFn: async () => {
            return id ? (await personsFindOne(id)) ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { person: data ?? null, isLoading };
}
