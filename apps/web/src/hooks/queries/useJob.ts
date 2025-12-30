import { api } from '@/api';
import { Job, Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetJob = (id: string) => {
    return useQuery<Job, Error>({
        queryKey: [Resource.Job],
        queryFn: async () => (await api.jobsFindOne(id)).data,
    });
};

const useGetJobList = () => {
    return useQuery<Job[], Error>({
        queryKey: [Resource.Job, 'list'],
        queryFn: async () => (await api.jobsFindAll()).data,
    });
};

export { useGetJob, useGetJobList };
