import ErrorDisplay from '@/components/utility/ErrorDisplay';
import useAppContext from '@/hooks/useAppContext';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PaymentListForm from './PaymentListForm';

export default function PaymentListPage() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { company, payPeriod } = useAppContext();
    const { t } = useTranslation();

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {company && <PaymentListForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
}
