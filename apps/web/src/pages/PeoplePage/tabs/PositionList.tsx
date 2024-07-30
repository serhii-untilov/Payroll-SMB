import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { usePositions } from '@/hooks/queries/usePositions';
import { FindAllPositionDto } from '@repo/openapi';
import PositionListTab from './PositionListTab';

export function PositionList(props: FindAllPositionDto) {
    const positions = usePositions(props);
    const { payPeriod: dateFrom } = useAppContext();
    const periods = usePayPeriods({ companyId: props.companyId, dateFrom });

    return (
        <>
            {(positions.isLoading || periods.isLoading) && <LoadingDisplay />}
            {positions.isError && <ErrorDisplay error={positions.error} />}
            {periods.isError && <ErrorDisplay error={periods.error} />}
            {positions.data && periods.data && periods.data.length && (
                <PositionListTab positions={positions.data} payPeriod={periods.data[0]} />
            )}
        </>
    );
}
