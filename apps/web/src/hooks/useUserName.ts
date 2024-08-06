import { capitalizeFirstChar } from '@/utils/capitalizeFirstChar';
import { User } from '@repo/openapi';
import { useMemo } from 'react';

export function useUserName(user: User | undefined) {
    return useMemo(() => {
        if (user) {
            const userName = `${user.firstName} ${user.lastName}`.trim();
            return capitalizeFirstChar(userName || user.email);
        }
        return undefined;
    }, [user]);
}

export function useUserFirstName(user: User | undefined) {
    return useMemo(() => {
        if (user) {
            const userName = `${user.firstName || user.lastName}`.trim();
            return capitalizeFirstChar(userName || user.email);
        }
        return undefined;
    }, [user]);
}
