import { useTranslation } from 'react-i18next';
import useLocale from '../hooks/useLocale';
import { useEffect } from 'react';

export default function CompanyList() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <h2>{t('Company list')}</h2>
        </>
    );
}
