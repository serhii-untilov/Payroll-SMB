import { Company } from '@repo/openapi';
import PaymentDoc from './PaymentDoc';

interface CreatePaymentProps {
    company: Company;
    payPeriod: Date;
    setPaymentId: (paymentId: number) => void;
}

export default function CreatePayment(props: CreatePaymentProps) {
    return <PaymentDoc {...props} goBack={true} />;
}
