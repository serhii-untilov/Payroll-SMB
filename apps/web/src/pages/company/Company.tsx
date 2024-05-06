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
import { AccountList } from './details/AccountList';
import { CompanyDetails } from './details/CompanyDetails';
import { DepartmentList } from './details/DepartmentList';
import { ManagerList } from './details/ManagerList';
import { getCompany } from '../../services/company.service';
import { ICompany } from '@repo/shared';
import { IconButton } from '@mui/material';
import { ArrowBackIosNewRounded } from '@mui/icons-material';

type Props = {
    showGoBack: boolean;
};

export default function Company(props: Props) {
    const { companyId } = useParams();
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const [company, setCompany] = useState<ICompany | null>();
    const { locale } = useLocale();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompany = async () => {
            const company = companyId ? await getCompany(+companyId) : null;
            setCompany(company);
        };
        fetchCompany();
    }, [companyId, setCompany]);

    useEffect(() => {}, [company, locale]);

    const generatePageTitle = () => {
        return company?.id ? company?.name || '' : t('New Company');
    };

    const onGoBack = () => {
        navigate(-1);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
            <Tabs id="company__details_tabs" value={value} onChange={handleChange}>
                <Tab label={t('Accounting Details')} />
                <Tab label={t('Departments')} disabled={!company?.id} />
                <Tab label={t('Managers')} disabled={!company?.id} />
                <Tab label={t('Accounts')} disabled={!company?.id} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <CompanyDetails companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DepartmentList companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ManagerList companyId={Number(companyId)} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <AccountList companyId={Number(companyId)} />
            </TabPanel>
        </PageLayout>
    );
}
