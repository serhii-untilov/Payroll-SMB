import { personsFindOne } from '@/services/person.service';
import { snackbarError } from '@/utils/snackbar';
import { Person } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Person | null | undefined; isLoading: boolean };

export function usePerson(id: number | null | undefined): Result {
    const { data, isError, isLoading, error } = useQuery<Person | null, Error>({
        queryKey: [ResourceType.PERSON, { id }],
        queryFn: async () => {
            return id ? await personsFindOne(id) : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
