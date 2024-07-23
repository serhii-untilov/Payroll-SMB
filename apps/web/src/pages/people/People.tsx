import { InputLabel } from '@/components/layout/InputLabel';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import { SelectPayPeriod } from '@/components/select/SelectPayPeriod';
import { useAppContext } from '@/hooks/useAppContext';
import { useLocale } from '@/hooks/useLocale';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PositionList } from './details/PositionList';

export default function People() {
    const [searchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const { company } = useAppContext();
    const { locale } = useLocale();
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('people-tab-index')),
    );
    const { t } = useTranslation();
    const { payPeriod } = useAppContext();

    useEffect(() => {}, [locale]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('people-tab-index', newValue.toString());
    };

    return (
        company &&
        payPeriod && (
            <PageLayout>
                <PageTitle goBack={goBack}>{t('People')}</PageTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                        <InputLabel>{t('Pay Period')}</InputLabel>
                        <SelectPayPeriod companyId={company?.id} sx={{ fontWeight: 'bold' }} />
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
                        <Tab label={t('Employees')} />
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
                    <TabPanel value={tab} index={1}>
                        {company?.id && (
                            <PositionList
                                companyId={company?.id}
                                employeesOnly={true}
                                relations={true}
                                onPayPeriodDate={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        {company?.id && (
                            <PositionList
                                companyId={company?.id}
                                vacanciesOnly={true}
                                relations={true}
                                onPayPeriodDate={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={5}>
                        {company?.id && (
                            <PositionList
                                companyId={company?.id}
                                employeesOnly={true}
                                dismissedOnly={true}
                                relations={true}
                                onPayPeriodDate={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={6}>
                        {company?.id && (
                            <PositionList
                                companyId={company?.id}
                                includeDeleted={true}
                                relations={true}
                            />
                        )}
                    </TabPanel>
                </Box>
            </PageLayout>
        )
    );
}

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    const map = {
        positions: 0,
        employees: 1,
        contractors: 2,
        vacancies: 3,
        offers: 4,
        dismissed: 5,
        all: 6,
    };
    return map[tabName];
}
