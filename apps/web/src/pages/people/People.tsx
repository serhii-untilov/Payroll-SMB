import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../../components/layout/InputLabel';
import PageLayout from '../../components/layout/PageLayout';
import { PayPeriod } from '../../components/layout/PayPeriod';
import { TabPanel } from '../../components/layout/TabPanel';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { PositionList } from './details/PositionList';
import { Tabs } from '../../components/layout/Tabs';
import { Tab } from '../../components/layout/Tab';

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
        <PageLayout title={t('People')}>
            <Grid container item spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3}>
                    <InputLabel>{t('Pay period')}</InputLabel>
                    <PayPeriod sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>
            <Box
                id="people__tabs-box"
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <Tabs id="people__tabs" value={value} onChange={handleChange}>
                    <Tab label={t('Employees')} />
                    <Tab disabled label={t('Contractors')} />
                    <Tab label={t('Vacancies')} />
                    <Tab disabled label={t('Offers')} />
                    <Tab label={t('Dismissed')} />
                    <Tab label={t('All')} />
                </Tabs>

                <TabPanel value={value} index={0} sx={{ flex: 1 }}>
                    {company?.id && <PositionList companyId={company?.id} />}
                </TabPanel>
                <TabPanel value={value} index={1} sx={{ flex: 1 }}>
                    {/* <CompanyManagers companyId={company?.id} /> */}
                </TabPanel>
                <TabPanel value={value} index={2} sx={{ flex: 1 }}>
                    {/* <CompanyAccounts companyId={company?.id} /> */}
                </TabPanel>
            </Box>
        </PageLayout>
    );
}
