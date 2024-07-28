import { jobsFindAll } from '@/services/job.service';
import { Job, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useJobs() {
    return useQuery<Job[], Error>({
        queryKey: [ResourceType.Job],
        queryFn: async () => await jobsFindAll(),
    });
}
