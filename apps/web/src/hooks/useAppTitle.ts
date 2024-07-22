import { appGetTitle } from '@/services/app.service';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { data: string; isLoading: boolean };

export function useAppTitle(): Result {
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
