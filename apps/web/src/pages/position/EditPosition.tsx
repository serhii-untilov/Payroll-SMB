import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPosition } from '@/hooks/queries/usePosition';
import { usePositionHistoryLast } from '@/hooks/queries/usePositionHistory';
import PositionForm from './PositionForm';

const EditPosition = ({ company, payPeriod, positionId, tabIndex, goBack }) => {
    const position = useGetPosition(positionId, {
        onPayPeriodDate: payPeriod.dateFrom,
        relations: true,
    });
    const positionHistory = usePositionHistoryLast({
        positionId,
        onPayPeriodDate: payPeriod.dateFrom,
        relations: true,
    });

    return (
        <>
            {(position.isLoading || positionHistory.isLoading) && <LoadingDisplay />}
            {position.isError && <ErrorDisplay error={position.error} />}
            {positionHistory.isError && <ErrorDisplay error={positionHistory.error} />}
            {position.data && positionHistory.data && (
                <PositionForm
                    {...{
                        company,
                        payPeriod,
                        position: position.data,
                        positionHistory: positionHistory.data,
                        tabIndex,
                        goBack,
                    }}
                />
            )}
        </>
    );
};

export default EditPosition;
