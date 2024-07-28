import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import useAppContext from '@/hooks/useAppContext';
import { usePosition } from '@/hooks/queries/usePositions';
import { usePositionHistoryLast } from '@/hooks/queries/usePositionHistory';
import PositionForm from './PositionForm';

interface EditPositionProps {
    positionId: number;
    tabIndex: string | null;
    goBack: boolean;
}

export default function EditPosition(props: EditPositionProps) {
    const { positionId, tabIndex, goBack } = props;
    const { payPeriod } = useAppContext();
    const {
        data: position,
        isLoading,
        isError,
        error,
    } = usePosition(positionId, {
        relations: true,
        onPayPeriodDate: payPeriod,
    });
    const {
        data: positionHistory,
        isLoading: isPositionHistoryLoading,
        isError: isPositionHistoryError,
        error: positionHistoryError,
    } = usePositionHistoryLast({
        positionId,
        onPayPeriodDate: payPeriod,
        relations: true,
    });

    return (
        <>
            {(isLoading || isPositionHistoryLoading) && <Loading />}
            {isError && <Error error={error} />}
            {isPositionHistoryError && <Error error={positionHistoryError} />}
            {position && positionHistory && (
                <PositionForm
                    position={position}
                    positionHistory={positionHistory}
                    tabIndex={tabIndex}
                    goBack={goBack}
                />
            )}
        </>
    );
}
