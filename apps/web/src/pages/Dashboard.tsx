import { useTranslation } from 'react-i18next';
import PageLayout from '../components/layout/PageLayout';
import useLocale from '../hooks/useLocale';
import { useEffect } from 'react';
import { Greeting } from '../components/layout/Greeting';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout title={t('Dashboard')}>
                <Greeting />
            </PageLayout>
        </>
    );
}
