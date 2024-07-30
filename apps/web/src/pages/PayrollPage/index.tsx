import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { useSearchParams } from 'react-router-dom';
import PayrollForm from './PayrollForm';

export default function PayrollPage() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { company, payPeriod: dateFrom } = useAppContext();
    const { data, isLoading, isError, error } = usePayPeriods({ companyId: company?.id, dateFrom });
    const payPeriod = data && data.length && data[0];

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {!company && <ErrorDisplay error={{ message: 'The company is not defined' }} />}
            {company && payPeriod && <PayrollForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
}
