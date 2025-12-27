import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPositionList } from '@/hooks/queries/usePosition';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { FindAllPositionDto } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import WorkScheduleList from './WorkScheduleList';

const PositionList = (props: FindAllPositionDto) => {
    const { data, isLoading, isError, error } = useGetPositionList(props);
    const payPeriod = useAppSelector(selectPayPeriod);
    const { t } = useTranslation();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {!payPeriod && <ErrorDisplay error={{ message: t('The pay period is not defined') }} />}
            {data && payPeriod && <WorkScheduleList rows={data} payPeriod={payPeriod} />}
        </>
    );
};

export default PositionList;
