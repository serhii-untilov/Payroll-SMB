import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
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
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <DashboardForm taskList={data} />}
        </>
    );
}
