import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ICompany } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { Loading } from '../../components/utility/Loading';
import useLocale from '../../hooks/useLocale';
import { getCompany } from '../../services/company.service';
import { CompanyAccounts } from './details/CompanyAccounts';
import { CompanyDepartments } from './details/CompanyDepartments';
import { CompanyDetails } from './details/CompanyDetails';
import { CompanyManagers } from './details/CompanyManagers';
import { CompanyPayPeriods } from './details/CompanyPayPeriods';

export default function Company() {
    const params = useParams();
    const companyId = Number(params.companyId);
    const [searchParams, setSearchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('company-tab-index')),
    );
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();

    useEffect(() => {}, [locale]);

    const { data, isError, isLoading, error } = useQuery<Partial<ICompany>, Error>({
        queryKey: ['company', { companyId }],
        queryFn: async () => {
            return companyId ? await getCompany(companyId) : {};
        },
    });

    const pageTitle = useMemo(() => {
        return data?.id ? data?.name || '' : t('New Company');
    }, [data, t]);

    if (isLoading) {
        return <Loading />;
    }

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('company-tab-index', newValue.toString());
    };

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
                <CompanyDetails companyId={companyId} />
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
