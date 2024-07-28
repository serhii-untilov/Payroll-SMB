import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import TotalSumChip from '@/components/TotalSumChip';
import useLocale from '@/hooks/useLocale';
import { useDocColor, useDocTitle, useDocTotalSum } from '@/hooks/usePaymentDoc';
import { Box } from '@mui/material';
import { Company, Payment } from '@repo/openapi';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePaymentTabs from './hooks/usePaymentTabs';

interface PaymentFormProps {
    company: Company;
    payPeriod: Date;
    payment?: Payment;
    tabIndex?: string | null;
    goBack?: boolean;
    setPaymentId?: (paymentId: number) => void;
}

export default function PaymentForm(props: PaymentFormProps) {
    const { company, payPeriod, payment, setPaymentId } = props;
    const { locale } = useLocale();
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const totalSum = useDocTotalSum(payment);
    const docTitle = useDocTitle(payment);
    const docColor = useDocColor(payment);
    const tabs = usePaymentTabs({ company, payPeriod, payment, setPaymentId });

    useEffect(() => {}, [locale]);

    return (
        company &&
        payPeriod && (
            <PageLayout>
                <PageTitle goBack={true} title={docTitle}>
                    <TotalSumChip sum={totalSum} color={docColor} />
                </PageTitle>
                <Box
                    id="payment__tabs-box"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <TabsContainer name={'payment-tabs'} tabIndex={tabIndex} tabs={tabs} />
                </Box>
            </PageLayout>
        )
    );
}
