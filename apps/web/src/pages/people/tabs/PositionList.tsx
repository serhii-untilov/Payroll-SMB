import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useGetPayPeriodList } from '@/hooks/queries/usePayPeriod';
import { useGetPositionList } from '@/hooks/queries/usePosition';
import { FindAllPositionDto } from '@repo/openapi';
import PositionsTab from './PositionsTab';

const PositionList = (props: FindAllPositionDto) => {
    const positions = useGetPositionList(props);
    const { payPeriod: dateFrom } = useAppContext();
    const periods = useGetPayPeriodList({ companyId: props.companyId, dateFrom });

    return (
        <>
            {(positions.isLoading || periods.isLoading) && <LoadingDisplay />}
            {positions.isError && <ErrorDisplay error={positions.error} />}
            {periods.isError && <ErrorDisplay error={periods.error} />}
            {positions.data && periods.data && periods.data.length && (
                <PositionsTab positions={positions.data} payPeriod={periods.data[0]} />
            )}
        </>
    );
};

export default PositionList;
