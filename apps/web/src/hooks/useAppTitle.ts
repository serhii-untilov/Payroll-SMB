import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { snackbarError } from '../utils/snackbar';
import { api } from '../api';

type Result = { data: string; isLoading: boolean };

export function useAppTitle(): Result {
    const { data, isLoading, isError, error } = useQuery<string, Error>({
        queryKey: [ResourceType.APP_TITLE],
        queryFn: async () => (await api.appGetTitle()).data,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? 'Application Title', isLoading };
}
