import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import { useEffect } from 'react';
import DashboardForm from './DashboardForm';
import useTaskList from './hooks/useTaskList';

export default function DashboardPage() {
    const { company, themeMode } = useAppContext();
    const companyId = company?.id;
    const onPayPeriodDate = company?.payPeriod;
    const { data, isLoading, isError, error } = useTaskList({ companyId, onPayPeriodDate });
    const { locale } = useLocale();

    useEffect(() => {}, [locale, themeMode]);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <DashboardForm taskList={data} />}
        </>
    );
}
