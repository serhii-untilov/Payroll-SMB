import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../../components/layout/InputLabel';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { SelectPayPeriod } from '../../components/select/SelectPayPeriod';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { PositionList } from './details/PositionList';

export default function People() {
    const { company } = useAppContext();
    const { locale } = useLocale();
    const [tab, setTab] = useState(Number(localStorage.getItem('people-tab-index')));
    const { t } = useTranslation();
    const { payPeriod } = useAppContext();

    useEffect(() => {}, [locale]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('people-tab-index', newValue.toString());
    };

    return (
        <PageLayout>
            <PageTitle>{t('People')}</PageTitle>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                    <InputLabel>{t('Pay Period')}</InputLabel>
                    <SelectPayPeriod sx={{ fontWeight: 'bold' }} />
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
                <Tabs id="people__tabs" value={tab} onChange={handleChange}>
                    <Tab label={t('Positions')} />
                    <Tab disabled label={t('Contractors')} />
                    <Tab label={t('Vacancies')} />
                    <Tab disabled label={t('Offers')} />
                    <Tab label={t('Dismissed')} />
                    <Tab label={t('All')} />
                </Tabs>

                <TabPanel value={tab} index={0}>
                    {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )}
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            vacanciesOnly={true}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )}
                </TabPanel>
                <TabPanel value={tab} index={4}>
                    {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            dismissedOnly={true}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )}
                </TabPanel>
            </Box>
        </PageLayout>
    );
}
