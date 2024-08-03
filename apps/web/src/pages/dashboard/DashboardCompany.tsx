import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetCurrentPayPeriod } from '@/hooks/queries/usePayPeriod';
import DashboardForm from './DashboardForm';

const DashboardCompany = ({ company, taskList }) => {
    const {
        data: payPeriod,
        isLoading,
        isError,
        error,
    } = useGetCurrentPayPeriod({ companyId: company.id, fullFieldList: true });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {payPeriod && <DashboardForm {...{ company, payPeriod, taskList }} />}
        </>
    );
};

export default DashboardCompany;
