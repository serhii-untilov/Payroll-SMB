import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CreatePayment from './CreatePayment';
import EditPayment from './EditPayment';

export default function PaymentPage() {
    const params = useParams();
    const [paymentId, setPaymentId] = useState(params.paymentId);
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);

    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The company is not defined' }} />}
            {!payPeriod && <ErrorDisplay error={{ message: 'The Pay Period is not defined' }} />}
            {!!paymentId && company && payPeriod && (
                <EditPayment {...{ company, payPeriod, paymentId, tabIndex, goBack }} />
            )}
            {!paymentId && company && payPeriod && (
                <CreatePayment {...{ company, payPeriod, setPaymentId }} />
            )}
        </>
    );
}
