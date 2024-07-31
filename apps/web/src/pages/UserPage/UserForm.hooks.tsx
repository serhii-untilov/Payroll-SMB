import { TabComponent } from '@/components/layout/TabsContainer';
import { useTranslation } from 'react-i18next';
import { User } from '@repo/openapi';
import { useMemo } from 'react';
import UserCompaniesTab from './tabs/UserCompaniesTab';
import UserDetailsTab from './tabs/UserDetailsTab';

export default function useUserForm(user: User) {
    const { t } = useTranslation();
    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('User Profile'),
                tab: <UserDetailsTab user={user} />,
            },
            {
                label: t('Companies'),
                disabled: !user?.id,
                tab: user && <UserCompaniesTab user={user} />,
            },
        ],
        [t, user],
    );
    return { tabs };
}
