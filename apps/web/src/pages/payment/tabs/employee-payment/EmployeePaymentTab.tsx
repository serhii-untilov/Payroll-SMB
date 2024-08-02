import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePaymentPositions } from '@/hooks/queries/usePayments';
import EmployeePaymentsList from './EmployeePaymentList';

const EmployeePaymentTab = ({ company, payPeriod, payment }) => {
    const {
        data: paymentList,
        isLoading,
        isError,
        error,
    } = usePaymentPositions({
        paymentId: payment.id,
        relations: true,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {paymentList && (
                <EmployeePaymentsList {...{ company, payPeriod, payment, paymentList }} />
            )}
        </>
    );
};

export default EmployeePaymentTab;
