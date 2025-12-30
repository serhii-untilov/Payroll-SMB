import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import TotalSumChip from '@/components/TotalSumChip';
import { Box } from '@mui/material';
import { Company, Payment, PayPeriod } from '@repo/openapi';
import usePaymentForm from './PaymentForm.hooks';

export interface PaymentFormProps {
    company: Company;
    payPeriod: PayPeriod;
    payment?: Payment;
    tabIndex?: string | null;
    goBack?: boolean;
    setPaymentId?: (paymentId: string) => void;
}

const PaymentForm = (props: PaymentFormProps) => {
    const { title, totalSum, color, tabs } = usePaymentForm(props);
    return (
        props.company &&
        props.payPeriod && (
            <PageLayout>
                <PageTitle goBack={true} title={title}>
                    <TotalSumChip sum={totalSum} color={color} />
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
                    <TabsContainer id="payment-tabs" tabIndex={props.tabIndex} tabs={tabs} />
                </Box>
            </PageLayout>
        )
    );
};

export default PaymentForm;
