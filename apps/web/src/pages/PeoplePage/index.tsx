import ErrorDisplay from '@/components/utility/ErrorDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PeopleForm from './PeopleForm';

export default function PeoplePage() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { company, payPeriod } = useAppContext();
    const { t } = useTranslation();

    return (
        <>
            {!company && <ErrorDisplay error={{ message: t('The company is not defined') }} />}
            {company && <PeopleForm {...{ company, payPeriod, tabIndex, goBack }} />}
        </>
    );
}
