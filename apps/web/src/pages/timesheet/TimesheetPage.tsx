import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppSelector } from '@/store/store.hooks';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import TimesheetForm from './TimesheetForm';

const TimesheetPage = () => {
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
            {company && payPeriod && <TimesheetForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
};

export default TimesheetPage;
