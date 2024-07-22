import PageLayout from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import { AvatarBox } from '@/components/utility/AvatarBox';
import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import useLocale from '@/hooks/useLocale';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { UserCompanyList } from './details/UserCompanyList';
import { UserDetails } from './details/UserDetails';

export default function Profile() {
    const [searchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('profile-tab-index')),
    );
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { data: user, isLoading } = useCurrentUser();
    const title = useMemo(() => {
        const userName = `${user?.firstName} ${user?.lastName}`.trim();
        return user?.id ? userName || user?.email || t('Profile') : t('New user');
    }, [user, t]);

    useEffect(() => {}, [locale]);

    if (isLoading) {
        return <Loading />;
    }

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('profile-tab-index', newValue.toString());
    };

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

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    const map = { details: 0, companies: 1 };
    return map[tabName];
}
