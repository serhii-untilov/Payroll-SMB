import { appGetTitle } from '@/services/app.service';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function queryKey() {
    return [ResourceType.AppTitle];
}

export function useAppTitle() {
    return useQuery<string, Error>({
        queryKey: queryKey(),
        queryFn: async () => {
            return await appGetTitle();
        },
    });
}
