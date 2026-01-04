import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import CreatePosition from './CreatePosition';
import EditPosition from './EditPosition';

const PositionPage = () => {
    const params = useParams();
    const [positionId, setPositionId] = useState(Number(params.positionId));
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);
    const { t } = useTranslation();

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {!payPeriod && <ErrorDisplay error={{ message: t('The pay period is not defined') }} />}
            {!!positionId && !!company && !!payPeriod && (
                <EditPosition {...{ company, payPeriod, positionId, tabIndex, goBack }} />
            )}
            {!positionId && !!company && !!payPeriod && <CreatePosition {...{ company, payPeriod, setPositionId }} />}
        </>
    );
};

export default PositionPage;
