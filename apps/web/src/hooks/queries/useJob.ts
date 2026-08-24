import { api } from '@/api';
import { JobEntity as Job, JobListItemDto, Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetJob = (id: string) => {
    return useQuery<Job, Error>({
        queryKey: [Resource.Job],
        queryFn: async () => (await api.jobFindOne(id)).data,
    });
};

const useGetJobList = () => {
    return useQuery<JobListItemDto[], Error>({
        queryKey: [Resource.Job, 'list'],
        queryFn: async () => (await api.jobFindAll({})).data.items,
    });
};

export { useGetJob, useGetJobList };
