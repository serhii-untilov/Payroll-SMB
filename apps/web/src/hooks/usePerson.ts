import { api, dto } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { id: number | null | undefined };
type Result = { data: dto.Person | undefined; isLoading: boolean };

export function usePerson(params: Params): Result {
    const { data, isError, isLoading, error } = useQuery<dto.Person | undefined, Error>({
        queryKey: [ResourceType.PERSON, params],
        queryFn: async () => {
            return params.id ? (await api.personsFindOne(params.id)).data : undefined;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
