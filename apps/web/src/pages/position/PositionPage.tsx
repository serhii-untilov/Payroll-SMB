import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CreatePosition from './CreatePosition';
import EditPosition from './EditPosition';
import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { useTranslation } from 'react-i18next';
import useAppContext from '@/hooks/context/useAppContext';

const PositionPage = () => {
    const params = useParams();
    const [positionId, setPositionId] = useState(Number(params.positionId));
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { company } = useAppContext();
    const { t } = useTranslation();

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {company && positionId && (
                <EditPosition {...{ company, positionId, tabIndex, goBack }} />
            )}
            {company && !positionId && <CreatePosition {...{ company, setPositionId }} />}
        </>
    );
};

export default PositionPage;
