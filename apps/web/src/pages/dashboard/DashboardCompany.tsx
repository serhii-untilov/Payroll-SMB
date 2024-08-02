import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/usePayPeriods';
import DashboardForm from './DashboardForm';

const DashboardCompany = ({ company, taskList }) => {
    const {
        data: payPeriod,
        isLoading,
        isError,
        error,
    } = useCurrentPayPeriod({ companyId: company.id, fullFieldList: true });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {payPeriod && <DashboardForm {...{ company, payPeriod, taskList }} />}
        </>
    );
};

export default DashboardCompany;
