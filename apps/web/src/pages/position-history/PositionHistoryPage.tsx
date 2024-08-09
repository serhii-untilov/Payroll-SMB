import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPosition } from '@/hooks/queries/usePosition';
import { usePositionHistoryList } from '@/hooks/queries/usePositionHistory';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { monthBegin } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PositionHistoryList from './PositionHistoryList';

const PositionHistoryPage = () => {
    const params = useParams();
    const positionId = Number(params.positionId);
    const { t } = useTranslation();
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);
    const position = useGetPosition(positionId, {
        onPayPeriodDate: payPeriod?.dateFrom ?? monthBegin(new Date()),
        relations: true,
    });
    const positionHistory = usePositionHistoryList({
        positionId,
        relations: true,
    });

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {!payPeriod && <ErrorDisplay error={{ message: t('The pay period is not defined') }} />}
            {(position.isLoading || positionHistory.isLoading) && <LoadingDisplay />}
            {position.isError && <ErrorDisplay error={position.error} />}
            {positionHistory.isError && <ErrorDisplay error={positionHistory.error} />}
            {position.data && positionHistory.data && (
                <PositionHistoryList position={position.data} history={positionHistory.data} />
            )}
        </>
    );
};

export default PositionHistoryPage;
