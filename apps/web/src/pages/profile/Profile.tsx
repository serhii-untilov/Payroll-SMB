import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import { AvatarBox } from '@/components/utility/AvatarBox';
import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/queries/useCurrentUser';
import useLocale from '@/hooks/useLocale';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { UserCompanyList, UserDetails } from './details';

export default function Profile() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { data: user, isLoading } = useCurrentUser();
    const title = useMemo(() => {
        const userName = `${user?.firstName} ${user?.lastName}`.trim();
        return user?.id ? userName || user?.email || t('Profile') : t('New user');
    }, [user, t]);

    useEffect(() => {}, [locale]);

    if (isLoading) return <Loading />;

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{title}</PageTitle>
            <AvatarBox />
            <Tabs id="user__details_tabs" value={tab} onChange={handleChange}>
                <Tab label={t('User Profile')} />
                <Tab label={t('Companies')} disabled={!user?.id} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <UserDetails />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <UserCompanyList userId={user?.id} />
            </TabPanel>
        </PageLayout>
    );
}
