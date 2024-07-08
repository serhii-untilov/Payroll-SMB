import { Law } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { snackbarError } from '../utils/snackbar';
import { ResourceType } from '@repo/shared';

type Result = { data: Law[]; isLoading: boolean };

export function useLawList(): Result {
    const { data, isError, isLoading, error } = useQuery<Law[], Error>({
        queryKey: [ResourceType.LAW, 'list'],
        queryFn: async () => {
            return (await api.lawsFindAll()).data || [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
