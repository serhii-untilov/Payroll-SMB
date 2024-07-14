import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { id: number | null | undefined };
type Result = { person: dto.Person | null | undefined; isLoading: boolean };

export function usePerson(params: Params): Result {
    const {
        data: person,
        isError,
        isLoading,
        error,
    } = useQuery<dto.Person | null, Error>({
        queryKey: [ResourceType.PERSON, params],
        queryFn: async () => {
            return params.id ? (await api.personsFindOne(params.id)).data ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { person, isLoading };
}
