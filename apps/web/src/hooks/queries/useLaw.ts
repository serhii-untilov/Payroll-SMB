import { api } from '@/api';
import { Law, Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetLaw = (id: string) => {
    return useQuery<Law, Error>({
        queryKey: [Resource.Law],
        queryFn: async () => (await api.lawsFindOne(id)).data,
    });
};

const useGetLawList = () => {
    return useQuery<Law[], Error>({
        queryKey: [Resource.Law, 'list'],
        queryFn: async () => (await api.lawsFindAll()).data,
    });
};

export { useGetLaw, useGetLawList };
