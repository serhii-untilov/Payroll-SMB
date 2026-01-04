import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import EmployeePaymentsList from './EmployeePaymentList';
import { useGetPaymentPositionList } from '@/hooks/queries/usePaymentPosition';

const EmployeePaymentTab = ({ company, payPeriod, payment }) => {
    const {
        data: paymentList,
        isLoading,
        isError,
        error,
    } = useGetPaymentPositionList({
        paymentId: payment.id,
        relations: true,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {paymentList && <EmployeePaymentsList {...{ company, payPeriod, payment, paymentList }} />}
        </>
    );
};

export default EmployeePaymentTab;
