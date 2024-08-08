import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPositionList } from '@/hooks/queries/usePosition';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { store } from '@/store/store';
import { FindAllPositionDto } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import PositionsTab from './PositionsTab';

const PositionList = (props: FindAllPositionDto) => {
    const { data, isLoading, isError, error } = useGetPositionList(props);
    const payPeriod = selectPayPeriod(store.getState());
    const { t } = useTranslation();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {!payPeriod && <ErrorDisplay error={{ message: t('The pay period is not defined') }} />}
            {data && payPeriod && <PositionsTab positions={data} payPeriod={payPeriod} />}
        </>
    );
};

export default PositionList;
