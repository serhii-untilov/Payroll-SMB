import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CreatePosition from './CreatePosition';
import EditPosition from './EditPosition';

export default function PositionPage() {
    const params = useParams();
    const [positionId, setPositionId] = useState(Number(params.positionId));
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';

    return (
        <>
            {positionId && <EditPosition {...{ positionId, tabIndex, goBack }} />}
            {!positionId && <CreatePosition {...{ setPositionId }} />}
        </>
    );
}
