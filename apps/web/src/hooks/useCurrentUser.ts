import { usersFindCurrent } from '@/services/auth.service';
import { snackbarError } from '@/utils/snackbar';
import { User } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: User | undefined; isLoading: boolean };

export function useCurrentUser(): Result {
    const { data, isError, isLoading, error } = useQuery<User | null, Error>({
        queryKey: [ResourceType.USER, 'current', { relations: true }],
        queryFn: async () => {
            return (await usersFindCurrent({ relations: true })) ?? null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? undefined, isLoading };
}
