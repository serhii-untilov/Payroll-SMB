import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CreatePayment from './CreatePayment';
import EditPayment from './EditPayment';
import Error from '@/components/utility/Error';
import useAppContext from '@/hooks/useAppContext';

export default function PaymentPage() {
    const params = useParams();
    const [paymentId, setPaymentId] = useState(Number(params.paymentId));
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { company, payPeriod } = useAppContext();

    return (
        <>
            {!company && <Error error={{ message: 'Company not defined.' }} />}
            {!payPeriod && <Error error={{ message: 'PayPeriod not defined.' }} />}
            {paymentId && company && payPeriod && (
                <EditPayment {...{ company, payPeriod, paymentId, tabIndex, goBack }} />
            )}
            {!paymentId && company && payPeriod && (
                <CreatePayment {...{ company, payPeriod, setPaymentId }} />
            )}
        </>
    );
}
