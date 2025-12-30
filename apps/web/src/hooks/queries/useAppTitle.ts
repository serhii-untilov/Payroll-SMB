import { api } from '@/api';
import { Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetAppTitle = () => {
    return useQuery<string, Error>({
        queryKey: [Resource.AppTitle],
        queryFn: async () => (await api.appGetTitle()).data,
    });
};

export { useGetAppTitle };
