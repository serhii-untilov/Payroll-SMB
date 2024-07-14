import PageLayout from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { getPayment } from '@/services/payment.service';
import { sumFormatter } from '@/utils';
import { Box, Chip } from '@mui/material';
import { IPayment, PaymentStatus, dateUTC } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { EmployeePayments } from './details/EmployeePayments';
import { MandatoryPayments } from './details/MandatoryPayments';
import { PaymentDetails } from './details/PaymentDetails';

export default function PaymentForm() {
    const { id } = useParams();
    const [paymentId, setPaymentId] = useState<number>(Number(id));
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const [searchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const [tab, setTab] = useState(
        Number(tabName ? getTabIndex(tabName) : localStorage.getItem('payment-tab-index')),
    );
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const {
        data: payment,
        isError,
        error,
    } = useQuery<Partial<IPayment>, Error>({
        queryKey: ['payment', { paymentId }],
        queryFn: async () => {
            return await getPayment({ id: paymentId, relations: true });
        },
        enabled: !!paymentId,
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('payment-tab-index', newValue.toString());
    };

    useEffect(() => {}, [locale]);

    const totalSum = useMemo(() => {
        return (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0);
    }, [payment]);

    const docTitle = useMemo(() => {
        return `${payment?.id ? payment?.paymentType?.name : t('New Payment')} `;
    }, [payment, t]);

    const docColor = useMemo(() => {
        const status = payment?.status || PaymentStatus.DRAFT;
        const docDate = dateUTC(payment?.docDate || new Date());
        const now = dateUTC(new Date());
        return status === PaymentStatus.DRAFT && docDate.getTime() <= now.getTime()
            ? 'warning'
            : 'primary';
    }, [payment]);

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    return (
        company &&
        payPeriod && (
            <PageLayout>
                <PageTitle goBack={true} title={docTitle}>
                    <Chip
                        label={sumFormatter(totalSum)}
                        size={'medium'}
                        color={docColor}
                        sx={{
                            display: 'inline',
                            p: 0.5,
                            ml: 1,
                            fontSize: '1rem',
                            color: (theme) => (theme.palette.mode === 'light' ? 'white' : 'black'),
                        }}
                    />
                </PageTitle>
                <Box
                    id="payments__tabs-box"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Tabs id="payments__tabs" value={tab} onChange={handleTabChange}>
                        <Tab label={t('Document')} />
                        <Tab label={t('Employees')} />
                        <Tab label={t('Mandatory Payments')} />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <PaymentDetails paymentId={paymentId} setPaymentId={setPaymentId} />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <EmployeePayments paymentId={paymentId} />
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <MandatoryPayments paymentId={paymentId} />
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
    const map = { document: 0, employees: 1, mandatoryPayments: 2 };
    return map[tabName];
}
