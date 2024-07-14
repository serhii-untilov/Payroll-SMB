import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Law } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Law[]; isLoading: boolean };

export function useLawList(): Result {
    const { data, isError, isLoading, error } = useQuery<Law[], Error>({
        queryKey: [ResourceType.LAW],
        queryFn: async () => {
            const response = (await api.lawsFindAll()).data ?? [];
            return response.sort((a: Law, b: Law) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
