import { Typography, TypographyProps } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';
import { getAppTitle } from '../../services/app.service';

export function AppTitle(props: TypographyProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const {
        data: title,
        isError,
        isLoading,
        error,
    } = useQuery<string, Error>({
        queryKey: ['appTitle'],
        queryFn: async () => await getAppTitle(),
    });

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
                {t(title || 'Payroll')}
            </Typography>
        </>
    );
}
