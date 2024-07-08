import { Typography, TypographyProps } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTitle } from '../../hooks/useAppTitle';
import useLocale from '../../hooks/useLocale';

export function AppTitle(props: TypographyProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { data: title } = useAppTitle();

    useEffect(() => {}, [locale]);

    return (
        <>
            <Typography component="h1" variant="h2" noWrap align="center" sx={{ mb: 2 }} {...props}>
                {t(title ?? 'Payroll')}
            </Typography>
        </>
    );
}
