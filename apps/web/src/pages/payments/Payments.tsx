import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { InputLabel } from '../../components/layout/InputLabel';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { SelectPayPeriod } from '../../components/select/SelectPayPeriod';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { PaymentList } from './details/PaymentList';

export default function Payments() {
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        Number(tabName ? getTabIndex(tabName) : localStorage.getItem('people-tab-index')),
    );
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('people-tab-index', newValue.toString());
    };

    return (
        company &&
        payPeriod && (
            <PageLayout>
                <PageTitle goBack={goBack}>{t('Payments')}</PageTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                        <InputLabel>{t('Pay Period')}</InputLabel>
                        <SelectPayPeriod companyId={company?.id} sx={{ fontWeight: 'bold' }} />
                    </Grid>
                </Grid>
                <Box
                    id="payments__tabs-box"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Tabs id="payments__tabs" value={tab} onChange={handleChange}>
                        <Tab label={t('To Pay')} />
                        <Tab label={t('Payed')} />
                        <Tab label={t('Company Payments')} />
                        <Tab label={t(`SCI Payments`)} />
                        <Tab label={t(`All`)} />
                    </Tabs>

                    <TabPanel value={tab} index={0}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={4}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={5}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
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
    const map = { payments: 0, appCalcSif: 1 };
    return map[tabName];
}
