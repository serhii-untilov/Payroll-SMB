import { useGetAppTitle } from '@/hooks/queries/useAppTitle';
import useLocale from '@/hooks/context/useLocale';
import { Typography, TypographyProps } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function AppTitle(props: TypographyProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { data: title } = useGetAppTitle();

    useEffect(() => {}, [locale]);

    return (
        <>
            {title && (
                <Typography
                    component="h1"
                    variant="h2"
                    noWrap
                    align="center"
                    sx={{ color: 'primary.main', my: 'auto' }}
                    {...props}
                >
                    {t(title)}
                </Typography>
            )}
        </>
    );
}
