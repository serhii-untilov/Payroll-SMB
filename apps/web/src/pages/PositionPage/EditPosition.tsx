import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { usePosition } from '@/hooks/queries/usePositions';
import { usePositionHistoryLast } from '@/hooks/queries/usePositionHistory';
import PositionForm from './PositionForm';
import { Company } from '@repo/openapi';

interface EditPositionProps {
    company: Company;
    positionId: number;
    tabIndex: string | null;
    goBack: boolean;
}

export default function EditPosition(props: EditPositionProps) {
    const { company, positionId, tabIndex, goBack } = props;
    const { payPeriod } = useAppContext();
    const position = usePosition(positionId, {
        onPayPeriodDate: payPeriod,
        relations: true,
    });
    const positionHistory = usePositionHistoryLast({
        positionId,
        onPayPeriodDate: payPeriod,
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
                        position: position.data,
                        positionHistory: positionHistory.data,
                        tabIndex,
                        goBack,
                    }}
                />
            )}
        </>
    );
}
