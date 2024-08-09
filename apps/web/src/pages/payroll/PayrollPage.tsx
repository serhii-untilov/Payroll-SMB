import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { useSearchParams } from 'react-router-dom';
import PayrollForm from './PayrollForm';

const PayrollPage = () => {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);

    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The company is not defined' }} />}
            {!payPeriod && <ErrorDisplay error={{ message: 'The pay period is not defined' }} />}
            {company && payPeriod && <PayrollForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
};

export default PayrollPage;
