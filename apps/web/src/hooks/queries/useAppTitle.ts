import { api } from '@/api';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetAppTitle = () => {
    return useQuery<string, Error>({
        queryKey: [ResourceType.AppTitle],
        queryFn: async () => (await api.appGetTitle()).data,
    });
};

export { useGetAppTitle };
