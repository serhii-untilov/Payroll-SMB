import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import { useCompany } from '@/hooks/useCompany';
import { useLocale } from '@/hooks/useLocale';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    CompanyAccounts,
    CompanyDepartments,
    CompanyDetails,
    CompanyManagers,
    CompanyPayPeriods,
} from './details';

export default function Company() {
    const params = useParams();
    const [companyId, setCompanyId] = useState(Number(params.companyId));
    const [searchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('company-tab-index')),
    );
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { data, isLoading } = useCompany(companyId);

    useEffect(() => {}, [locale]);

    const pageTitle = useMemo(() => {
        return data?.id ? data?.name ?? '' : t('New Company');
    }, [data, t]);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('company-tab-index', newValue.toString());
    };

    const submitCallback = (companyId: number) => setCompanyId(companyId);

    if (isLoading) return null;

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <Tabs id="company__details_tabs" value={tab} onChange={handleChange}>
                <Tab label={t('Accounting Details')} />
                <Tab label={t('Pay Periods')} disabled={!data?.id} />
                <Tab label={t('Departments')} disabled={!data?.id} />
                <Tab label={t('Company Managers')} disabled={!data?.id} />
                <Tab label={t('Accounts')} disabled={!data?.id} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <CompanyDetails companyId={companyId} submitCallback={submitCallback} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <CompanyPayPeriods companyId={companyId} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <CompanyDepartments companyId={companyId} />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <CompanyManagers companyId={companyId} />
            </TabPanel>
            <TabPanel value={tab} index={4}>
                <CompanyAccounts companyId={companyId} />
            </TabPanel>
        </PageLayout>
    );
}

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    const map = { details: 0, periods: 1, departments: 2, managers: 3, accounts: 4 };
    return map[tabName];
}
