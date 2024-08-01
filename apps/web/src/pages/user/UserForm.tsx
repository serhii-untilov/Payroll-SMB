import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import { AvatarBox } from '@/components/utility/AvatarBox';
import useLocale from '@/hooks/context/useLocale';
import useUserName from '@/hooks/useUserName';
import { User } from '@repo/openapi';
import { useEffect } from 'react';
import useUserForm from './hooks/UserForm.hooks';

type UserFormProps = {
    user: User;
    tabIndex: string | null;
    goBack: boolean;
};

export default function UserForm(props: UserFormProps) {
    const { user, tabIndex, goBack } = props;
    const { locale } = useLocale();
    const title = useUserName(user);
    const { tabs } = useUserForm(user);

    useEffect(() => {}, [locale]);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{title}</PageTitle>
            <AvatarBox />
            <TabsContainer id="user-profile-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
}
