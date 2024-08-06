import { api } from '@/api';
import { Law, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetLaw = (id: number) => {
    return useQuery<Law, Error>({
        queryKey: [ResourceType.Law],
        queryFn: async () => (await api.lawsFindOne(id)).data,
    });
};

const useGetLawList = () => {
    return useQuery<Law[], Error>({
        queryKey: [ResourceType.Law, 'list'],
        queryFn: async () => (await api.lawsFindAll()).data,
    });
};

export { useGetLaw, useGetLawList };
