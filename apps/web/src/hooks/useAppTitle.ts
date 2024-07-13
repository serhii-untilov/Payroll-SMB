import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: string | undefined; isLoading: boolean };

export function useAppTitle(): Result {
    const { data, isLoading, isError, error } = useQuery<string, Error>({
        queryKey: [ResourceType.APP_TITLE],
        queryFn: async () => {
            return (await api.appGetTitle()).data;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
