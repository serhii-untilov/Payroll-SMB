import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import useLocale from '@/hooks/context/useLocale';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// TODO
const TimeOffForm = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout>
                <PageTitle>{t('Time Off')}</PageTitle>
            </PageLayout>
        </>
    );
};

export default TimeOffForm;
