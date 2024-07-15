import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Job } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | null | undefined };
type Result = { data: Job[]; isLoading: boolean };

export function useJobList(params: Params): Result {
    const { companyId } = params;
    const { data, isError, isLoading, error } = useQuery<Job[], Error>({
        queryKey: [ResourceType.JOB, params],
        queryFn: async () => {
            const response = companyId ? (await api.jobsFindAll()).data ?? [] : [];
            return response.sort((a: Job, b: Job) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
