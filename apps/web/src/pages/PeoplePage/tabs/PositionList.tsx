import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePositions } from '@/hooks/queries/usePositions';
import { FindAllPositionDto } from '@repo/openapi';
import PositionListTab from './PositionListTab';

export function PositionList(props: FindAllPositionDto) {
    const { data, isLoading, isError, error } = usePositions(props);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PositionListTab positions={data} />}
        </>
    );
}
