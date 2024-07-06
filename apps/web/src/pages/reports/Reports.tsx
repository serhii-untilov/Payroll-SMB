import { useTranslation } from 'react-i18next';
import PageLayout from '../../components/layout/PageLayout';
import useLocale from '../../hooks/useLocale';
import { useEffect } from 'react';
import { PageTitle } from '../../components/layout/PageTitle';
import { useSearchParams } from 'react-router-dom';

export default function Reports() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const goBack = searchParams.get('return') === 'true';

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout>
                <PageTitle goBack={goBack}>{t('Reports')}</PageTitle>
            </PageLayout>
        </>
    );
}
