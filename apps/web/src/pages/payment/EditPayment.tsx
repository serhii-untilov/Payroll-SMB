import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePayment } from '@/hooks/queries/usePayments';
import PaymentForm from './PaymentForm';
import { Company } from '@repo/openapi';

interface EditPaymentProps {
    company: Company;
    payPeriod: Date;
    paymentId: number;
    tabIndex: string | null;
    goBack: boolean;
}

export default function EditPayment(props: EditPaymentProps) {
    const { company, payPeriod, paymentId, tabIndex, goBack } = props;
    const { data: payment, isLoading, isError, error } = usePayment(paymentId, { relations: true });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {payment && <PaymentForm {...{ company, payPeriod, payment, tabIndex, goBack }} />}
        </>
    );
}
