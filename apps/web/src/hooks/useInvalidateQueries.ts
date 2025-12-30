import { Resource } from '@repo/openapi';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useInvalidateQueries() {
    const queryClient = useQueryClient();

    const invalidateQueries = useCallback(
        async (resourceList: Resource[]) =>
            resourceList.forEach(async (key) => {
                await queryClient.invalidateQueries({ queryKey: [key], refetchType: 'all' });
            }),
        [queryClient],
    );

    const invalidateAllQueries = useCallback(
        async () => await queryClient.invalidateQueries({ queryKey: [], refetchType: 'all' }),
        [queryClient],
    );

    return { invalidateQueries, invalidateAllQueries };
}
