import { useTheme } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import useLocale from './hooks/useLocale.ts';
import './index.css';
import router from './router/router';

export default function App() {
    const content = useRoutes(router);
    const { locale } = useLocale();
    const theme = useTheme();
    const localeTheme = useMemo(() => createTheme(theme, locale.locale), [locale.locale, theme]);

    return (
        <>
            <CssBaseline enableColorScheme />
            <SnackbarProvider
                maxSnack={3}
                preventDuplicate
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <ThemeProvider theme={localeTheme}>{content}</ThemeProvider>
            </SnackbarProvider>
        </>
    );
}
