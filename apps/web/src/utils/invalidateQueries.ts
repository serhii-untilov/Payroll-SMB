import { ResourceType } from '@repo/openapi';
import { QueryClient } from '@tanstack/react-query';

export async function invalidateQueries(queryClient: QueryClient, resourceList: ResourceType[]) {
    resourceList.forEach(async (key) => {
        await queryClient.invalidateQueries({
            queryKey: [key],
            refetchType: 'all',
        });
    });
}
