import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useGetTaskList } from '../../hooks/queries/useTask';
import DashboardCompany from './DashboardCompany';
import DashboardForm from './DashboardForm';

const DashboardPage = () => {
    const { company } = useAppContext();
    const {
        data: taskList,
        isLoading,
        isError,
        error,
    } = useGetTaskList({ companyId: company?.id, onPayPeriodDate: company?.payPeriod });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {company && taskList && <DashboardCompany {...{ company, taskList }} />}
            {!company && taskList && <DashboardForm {...{ taskList }} />}
        </>
    );
};

export default DashboardPage;
