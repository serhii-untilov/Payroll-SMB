import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../../components/layout/PageLayout';
import { TabPanel } from '../../components/layout/TabPanel';
import useLocale from '../../hooks/useLocale';
import { CompanyAccounts } from '../company/CompanyAccounts';
import { CompanyDepartments } from '../company/CompanyDepartments';
import { CompanyManagers } from '../company/CompanyManagers';
import useAppContext from '../../hooks/useAppContext';

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
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Box
                    // sx={{ borderBottom: 0.5, borderColor: 'divider' }}
                    >
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
                    </Box>
                    <TabPanel value={value} index={0} sx={{ flex: 1 }}>
                        {/* <CompanyDepartments companyId={company?.id} /> */}
                    </TabPanel>
                    <TabPanel value={value} index={1} sx={{ flex: 1 }}>
                        {/* <CompanyManagers companyId={company?.id} /> */}
                    </TabPanel>
                    <TabPanel value={value} index={2} sx={{ flex: 1 }}>
                        {/* <CompanyAccounts companyId={company?.id} /> */}
                    </TabPanel>
                </Box>
            </PageLayout>
        </>
    );
}
