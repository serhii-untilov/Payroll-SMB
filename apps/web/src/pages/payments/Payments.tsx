import { useTranslation } from 'react-i18next';
import PageLayout from '../../components/layout/PageLayout';
import useLocale from '../../hooks/useLocale';
import { useEffect } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';

export default function Payments() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout>
                <PageTitle>{t('Payments')}</PageTitle>
            </PageLayout>
        </>
    );
}
