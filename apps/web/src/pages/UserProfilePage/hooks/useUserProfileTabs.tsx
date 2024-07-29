import { TabComponent } from '@/components/layout/TabsContainer';
import { useTranslation } from 'react-i18next';
import { User } from '@repo/openapi';
import { useMemo } from 'react';
import { UserCompanyList } from '../tabs/UserCompanyList';
import UserDetailsForm from '../tabs/UserDetailsForm';

export default function useUserProfileTabs(user: User) {
    const { t } = useTranslation();
    return useMemo<TabComponent[]>(
        () => [
            {
                label: t('User Profile'),
                tab: <UserDetailsForm user={user} />,
            },
            {
                label: t('Companies'),
                disabled: !user?.id,
                tab: <UserCompanyList user={user} />,
            },
        ],
        [t, user],
    );
}
