import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SalaryReport } from './details/SalaryReport';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { InputLabel } from '@/components/layout/InputLabel';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Tabs } from '@/components/layout/Tabs';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';

export default function Payroll() {
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        company &&
        payPeriod && (
            <PageLayout>
                <PageTitle goBack={goBack}>{t('Salary Report')}</PageTitle>
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
                        <Tab label={t('Payroll')} />
                        <Tab label={t(`Employer Expenses`)} />
                        <Tab label={t('Summary Report')} />

                        <Tab label={t('Accounting Entries')} />
                    </Tabs>

                    <TabPanel value={tab} index={0}>
                        {company?.id && (
                            <SalaryReport
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        {/* {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            employeesOnly={true}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )} */}
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        {/* {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            vacanciesOnly={true}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )} */}
                    </TabPanel>
                    <TabPanel value={tab} index={5}>
                        {/* {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            employeesOnly={true}
                            dismissedOnly={true}
                            relations={true}
                            onPayPeriodDate={payPeriod || new Date()}
                        />
                    )} */}
                    </TabPanel>
                    <TabPanel value={tab} index={6}>
                        {/* {company?.id && (
                        <PositionList
                            companyId={company?.id}
                            includeDeleted={true}
                            relations={true}
                        />
                    )} */}
                    </TabPanel>
                </Box>
            </PageLayout>
        )
    );
}
