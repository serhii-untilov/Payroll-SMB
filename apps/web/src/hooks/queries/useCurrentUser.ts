import { usersFindCurrent } from '@/services/auth/auth.service';
import { ResourceType, User } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
    return useQuery<User, Error>({
        queryKey: [ResourceType.User, 'current', { relations: true }],
        queryFn: async () => await usersFindCurrent({ relations: true }),
    });
}
