import { lawsFindAll } from '@/services/law.service';
import { snackbarError } from '@/utils/snackbar';
import { Law } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Law[]; isLoading: boolean };

export function useLawList(): Result {
    const { data, isError, isLoading, error } = useQuery<Law[], Error>({
        queryKey: [ResourceType.Law],
        queryFn: async () => {
            return (await lawsFindAll()) ?? [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
