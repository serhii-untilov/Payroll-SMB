import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
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
    const { data: payment, isLoading, isError, error } = usePayment(paymentId);

    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {payment && <PaymentForm {...{ company, payPeriod, payment, tabIndex, goBack }} />}
        </>
    );
}
