import { api } from '@/api';
import { Job, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetJob = (id: number) => {
    return useQuery<Job, Error>({
        queryKey: [ResourceType.Job],
        queryFn: async () => (await api.jobsFindOne(id)).data,
    });
};

const useGetJobList = () => {
    return useQuery<Job[], Error>({
        queryKey: [ResourceType.Job, 'list'],
        queryFn: async () => (await api.jobsFindAll()).data,
    });
};

export { useGetJob, useGetJobList };
