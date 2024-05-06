import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { AccountList } from './details/AccountList';
import { AccountingDetails } from './details/CompanyDetails';
import { DepartmentList } from './details/DepartmentList';
import { ManagerList } from './details/ManagerList';

export default function Company() {
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const { company } = useAppContext();
    const { locale } = useLocale();
    const navigate = useNavigate();

    useEffect(() => {}, [company, locale]);

    const generatePageTitle = () => {
        return company?.id ? company?.name || '' : t('New Company');
    };

    const onCancel = () => {
        navigate(-1);
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PageLayout>
            <PageTitle>
                {/* <IconButton aria-label="Go Back" color="primary" sx={{ mr: 1 }} onClick={onCancel}>
                    <ArrowBackIosNewRounded />
                </IconButton> */}
                {generatePageTitle()}
            </PageTitle>
            <Tabs
                id="company__details_tabs"
                value={value}
                onChange={handleChange}
                // textColor={'inherit'}
                // indicatorColor="primary"
            >
                <Tab label={t('Accounting Details')} />
                <Tab label={t('Departments')} disabled={!company?.id} />
                <Tab label={t('Managers')} disabled={!company?.id} />
                <Tab label={t('Accounts')} disabled={!company?.id} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <AccountingDetails companyId={company?.id} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DepartmentList companyId={company?.id} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ManagerList companyId={company?.id} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <AccountList companyId={company?.id} />
            </TabPanel>
        </PageLayout>
    );
}
