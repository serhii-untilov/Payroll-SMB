import { Company, PayPeriod } from '@repo/openapi';
import PaymentForm from './PaymentForm';

interface CreatePaymentProps {
    company: Company;
    payPeriod: PayPeriod;
    setPaymentId: (paymentId: number) => void;
}

export default function CreatePayment(props: CreatePaymentProps) {
    return <PaymentForm {...props} goBack={true} />;
}
