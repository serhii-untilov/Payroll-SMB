import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useGetPosition } from '@/hooks/queries/usePosition';
import { usePositionHistoryList } from '@/hooks/queries/usePositionHistory';
import { useParams } from 'react-router-dom';
import PositionHistoryList from './PositionHistoryList';

const PositionHistoryPage = () => {
    const params = useParams();
    const positionId = Number(params.positionId);
    const { payPeriod } = useAppContext();
    const position = useGetPosition(positionId, {
        onPayPeriodDate: payPeriod,
        relations: true,
    });
    const positionHistory = usePositionHistoryList({
        positionId,
        relations: true,
    });

    return (
        <>
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
