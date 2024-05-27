import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { CompanyAccounts } from './details/CompanyAccounts';
import { CompanyDetails } from './details/CompanyDetails';
import { CompanyDepartments } from './details/CompanyDepartments';
import { CompanyManagers } from './details/CompanyManagers';
import { getCompany } from '../../services/company.service';
import { ICompany } from '@repo/shared';
import { IconButton } from '@mui/material';
import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { CompanyPayPeriods } from './details/CompanyPayPeriods';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../../components/utility/Loading';

type Props = {
    showGoBack: boolean;
};

export default function Company(props: Props) {
    const params = useParams();
    const companyId = Number(params.companyId);
    // const [companyId, setCompanyId] = useState(Number(params.companyId));
    const [tab, setTab] = useState(Number(localStorage.getItem('company-tab-index')));
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

    const onGoBack = () => {
        navigate(-1);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('company-tab-index', newValue.toString());
    };

    return (
        <PageLayout>
            <PageTitle>
                {companyId ? null : (
                    <IconButton
                        aria-label="Go Back"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={onGoBack}
                    >
                        <ArrowBackIosNewRounded />
                    </IconButton>
                )}
                {pageTitle}
            </PageTitle>
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
