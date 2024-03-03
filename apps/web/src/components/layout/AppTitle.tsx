import { Typography, TypographyProps } from '@mui/material';
import useLocale from '../../hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function AppTitle(props: TypographyProps) {
    const title = import.meta.env['VITE_APP_TITLE'] || import.meta.env['TITLE'];
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <Typography
                component="h1"
                variant="h2"
                noWrap
                align="center"
                sx={{ mb: 2 }}
                {...props}
                color="text.primary"
            >
                {t(title)}
            </Typography>
        </>
    );
}
