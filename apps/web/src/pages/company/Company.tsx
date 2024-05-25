import { SyntheticEvent, useEffect, useState } from 'react';
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

type Props = {
    showGoBack: boolean;
};

export default function Company(props: Props) {
    const { companyId } = useParams();
    const [tab, setTab] = useState(Number(localStorage.getItem('company-tab-index')));
    const { t } = useTranslation();
    // const [company, setCompany] = useState<ICompany | null>();
    const { locale } = useLocale();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchCompany = async () => {
    //         const company = companyId ? await getCompany(+companyId) : null;
    //         setCompany(company);
    //     };
    //     fetchCompany();
    // }, [companyId, setCompany]);

    // useEffect(() => {}, [company, locale]);
    useEffect(() => {}, [locale]);

    const {
        data: company,
        isError: isCompanyError,
        isLoading: isCompanyLoading,
        error: companyError,
    } = useQuery<Partial<ICompany>, Error>({
        queryKey: ['company', { companyId }],
        queryFn: async () => {
            return companyId ? await getCompany(+companyId) : {};
        },
        enabled: !!companyId,
    });

    const generatePageTitle = () => {
        return company?.id ? company?.name || '' : t('New Company');
    };

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
                {generatePageTitle()}
            </PageTitle>
            <Tabs id="company__details_tabs" value={tab} onChange={handleChange}>
                <Tab label={t('Accounting Details')} />
                <Tab label={t('Pay Periods')} disabled={!company?.id} />
                <Tab label={t('Departments')} disabled={!company?.id} />
                <Tab label={t('Company Managers')} disabled={!company?.id} />
                <Tab label={t('Accounts')} disabled={!company?.id} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <CompanyDetails companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <CompanyPayPeriods companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <CompanyDepartments companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <CompanyManagers companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={tab} index={4}>
                <CompanyAccounts companyId={Number(companyId)} />
            </TabPanel>
        </PageLayout>
    );
}
