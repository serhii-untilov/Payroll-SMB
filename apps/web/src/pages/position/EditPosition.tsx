import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useGetPosition } from '@/hooks/queries/usePosition';
import { usePositionHistoryLast } from '@/hooks/queries/usePositionHistory';
import { Company } from '@repo/openapi';
import PositionForm from './PositionForm';

interface EditPositionProps {
    company: Company;
    positionId: number;
    tabIndex: string | null;
    goBack: boolean;
}

const EditPosition = (props: EditPositionProps) => {
    const { company, positionId, tabIndex, goBack } = props;
    const { payPeriod } = useAppContext();
    const position = useGetPosition(positionId, {
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
};

export default EditPosition;
