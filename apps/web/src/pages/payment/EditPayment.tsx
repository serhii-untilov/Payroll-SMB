import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPayment } from '@/hooks/queries/usePayment';
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
    const {
        data: payment,
        isLoading,
        isError,
        error,
    } = useGetPayment(paymentId, { relations: true });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {payment && <PaymentForm {...{ company, payPeriod, payment, tabIndex, goBack }} />}
        </>
    );
}
