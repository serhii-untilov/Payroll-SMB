import { useTranslation } from 'react-i18next';
import useLocale from '../hooks/useLocale';
import { useEffect } from 'react';

export default function Companies() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <h2>{t('Companies')}</h2>
        </>
    );
}