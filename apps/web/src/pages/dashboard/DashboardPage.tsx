import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useTasks } from '../../hooks/queries/useTasks';
import DashboardCompany from './DashboardCompany';
import DashboardForm from './DashboardForm';

const DashboardPage = () => {
    const { company } = useAppContext();
    const {
        data: taskList,
        isLoading,
        isError,
        error,
    } = useTasks({ companyId: company?.id, onPayPeriodDate: company?.payPeriod });

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
