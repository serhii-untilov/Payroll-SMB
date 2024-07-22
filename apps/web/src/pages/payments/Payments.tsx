import {
    InputLabel,
    PageLayout,
    PageTitle,
    SelectPayPeriod,
    Tab,
    TabPanel,
    Tabs,
} from '@/components';
import { useAppContext, useLocale } from '@/hooks';
import { Box, Grid } from '@mui/material';
import { PaymentStatus } from '@repo/openapi';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PaymentList } from './details/PaymentList';

export default function Payments() {
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const [searchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        Number(tabName ? getTabIndex(tabName) : localStorage.getItem('people-tab-index')),
    );
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
                        <Tab label={t('Paid')} />
                        <Tab label={t('Company Payments')} />
                        <Tab label={t(`SCI Payments`)} />
                        <Tab label={t(`All`)} />
                    </Tabs>

                    <TabPanel value={tab} index={0}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                                status={PaymentStatus.Draft}
                                companyPayments={true}
                                sifPayments={true}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                                status={PaymentStatus.Paid}
                                companyPayments={true}
                                sifPayments={true}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                                companyPayments={true}
                                sifPayments={false}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                                companyPayments={false}
                                sifPayments={true}
                            />
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={4}>
                        {company?.id && (
                            <PaymentList
                                companyId={company?.id}
                                payPeriod={payPeriod || new Date()}
                                companyPayments={true}
                                sifPayments={true}
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
    const map = { pay: 0, paid: 1, companyPayments: 2, sciPayments: 3, all: 4 };
    return map[tabName];
}
