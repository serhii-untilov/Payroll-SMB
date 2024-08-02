import { jobsFindAll } from '@/services/api/job.service';
import { Job, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const queryKey = ResourceType.Job;

export function useJobs() {
    return useQuery<Job[], Error>({
        queryKey: [queryKey],
        queryFn: async () => await jobsFindAll(),
    });
}
