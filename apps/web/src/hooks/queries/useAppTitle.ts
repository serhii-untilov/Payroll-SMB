import { appGetTitle } from '@/services/api/app.service';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useAppTitle() {
    const { data, isLoading, isError, error } = useQuery<string, Error>({
        queryKey: [ResourceType.AppTitle],
        queryFn: async () => {
            return await appGetTitle();
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? '', isLoading };
}
