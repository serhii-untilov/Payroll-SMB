import { Box, Grid, Select, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../../components/layout/PageLayout';
import { TabPanel } from '../../components/layout/TabPanel';
import useLocale from '../../hooks/useLocale';
import { CompanyAccounts } from '../company/CompanyAccounts';
import { CompanyDepartments } from '../company/CompanyDepartments';
import { CompanyManagers } from '../company/CompanyManagers';
import useAppContext from '../../hooks/useAppContext';
import { PayPeriod } from '../../components/layout/PayPeriod';
import { InputLabel } from '../../components/layout/InputLabel';
import { PeopleEmployees } from './PeopleEmployees';

export default function People() {
    const { company } = useAppContext();
    const { locale } = useLocale();
    const [value, setValue] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <PageLayout title={t('People')}>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid container item spacing={2}>
                        <Grid item xs={12} sm={8} md={6} lg={3}>
                            <InputLabel>{t('Pay period')}</InputLabel>
                            <PayPeriod sx={{ fontWeight: 'bold' }} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={5}>
                            <InputLabel>{t('Department')}</InputLabel>
                            <Select size="small" margin="none" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={4}>
                            <InputLabel>{t('Job')}</InputLabel>
                            <Select size="small" margin="none" fullWidth />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={2}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            // textColor={'inherit'}
                            // indicatorColor="primary"
                        >
                            <Tab label={t('Employees')} />
                            <Tab label={t('Contractors')} />
                            <Tab label={t('Vacancies')} />
                            <Tab label={t('Offers')} />
                            <Tab label={t('Dismissed')} />
                            <Tab label={t('All')} />
                        </Tabs>
                    </Grid>
                    <TabPanel value={value} index={0} sx={{ flex: 1 }}>
                        {company?.id && <PeopleEmployees companyId={company?.id} />}
                    </TabPanel>
                    <TabPanel value={value} index={1} sx={{ flex: 1 }}>
                        {/* <CompanyManagers companyId={company?.id} /> */}
                    </TabPanel>
                    <TabPanel value={value} index={2} sx={{ flex: 1 }}>
                        {/* <CompanyAccounts companyId={company?.id} /> */}
                    </TabPanel>
                </Grid>
            </PageLayout>
        </>
    );
}
