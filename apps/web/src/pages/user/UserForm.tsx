import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import { AvatarBox } from '@/components/utility/AvatarBox';
import useLocale from '@/hooks/context/useLocale';
import { useUserName } from '@/hooks/useUserName';
import { User } from '@repo/openapi';
import { useEffect } from 'react';
import useUserForm from './UserForm.hooks';
import { useTranslation } from 'react-i18next';

type UserFormProps = {
    user: User;
    tabIndex: string | null;
    goBack: boolean;
};

const UserForm = (props: UserFormProps) => {
    const { user, tabIndex, goBack } = props;
    const { locale } = useLocale();
    const userName = useUserName(user);
    const { tabs } = useUserForm(user);
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{userName ?? t('New user')}</PageTitle>
            <AvatarBox />
            <TabsContainer id="user-profile-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
};

export default UserForm;
