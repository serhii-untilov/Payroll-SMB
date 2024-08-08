import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod } from '@/store/slices/payPeriodSlice';
import { store } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PaymentsForm from './PaymentsForm';

const PaymentsPage = () => {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const company = selectCompany(store.getState());
    const payPeriod = selectPayPeriod(store.getState());
    const { t } = useTranslation();

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {!payPeriod && <ErrorDisplay error={{ message: t('The pay period is not defined') }} />}
            {company && payPeriod && <PaymentsForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
};

export default PaymentsPage;
