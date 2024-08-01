import { TabComponent } from '@/components/layout/TabsContainer';
import { useTranslation } from 'react-i18next';
import { User } from '@repo/openapi';
import { useMemo } from 'react';
import UserCompanyTab from '../tabs/companies/UserCompanyTab';
import UserDetailsTab from '../tabs/user/UserDetailsTab';

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
                tab: user && <UserCompanyTab user={user} />,
            },
        ],
        [t, user],
    );
    return { tabs };
}
