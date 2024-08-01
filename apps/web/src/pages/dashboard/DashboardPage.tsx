import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import { useEffect } from 'react';
import DashboardForm from './DashboardForm';
import { useTasks } from '../../hooks/queries/useTasks';
import DashboardCompany from './DashboardCompany';

export default function DashboardPage() {
    const { company, themeMode } = useAppContext();
    const companyId = company?.id;
    const {
        data: taskList,
        isLoading,
        isError,
        error,
    } = useTasks({ companyId, onPayPeriodDate: company?.payPeriod });
    const { locale } = useLocale();

    useEffect(() => {}, [locale, themeMode]);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {company && taskList && <DashboardCompany {...{ company, taskList }} />}
            {!company && taskList && <DashboardForm {...{ taskList }} />}
        </>
    );
}
