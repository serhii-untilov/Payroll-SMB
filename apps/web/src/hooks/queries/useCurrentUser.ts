import { usersFindCurrent } from '@/services/auth.service';
import { ResourceType, User } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
    return useQuery<User | null, Error>({
        queryKey: [ResourceType.User, 'current', { relations: true }],
        queryFn: async () => {
            return (await usersFindCurrent({ relations: true })) ?? null;
        },
    });
}
