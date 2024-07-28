import { User } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useUserName(user: User | undefined) {
    const { t } = useTranslation();
    return useMemo(() => {
        const userName = `${user?.firstName} ${user?.lastName}`.trim();
        return user?.id ? userName || user?.email || t('Profile') : t('New user');
    }, [user, t]);
}
