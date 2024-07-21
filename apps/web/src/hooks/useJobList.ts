import { jobsFindAll } from '@/services/job.service';
import { snackbarError } from '@/utils/snackbar';
import { Job } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Job[]; isLoading: boolean };

export function useJobList(): Result {
    const { data, isError, isLoading, error } = useQuery<Job[], Error>({
        queryKey: [ResourceType.Job],
        queryFn: async () => {
            return await jobsFindAll();
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
