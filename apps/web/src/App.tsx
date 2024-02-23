import { useTheme } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { enUS, ukUA } from '@mui/material/locale';
import { SnackbarProvider } from 'notistack';
import { useMemo, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { LocaleProvider } from './context/LocaleContext.tsx';
import './index.css';
import router from './router/router';
import useLocale from './hooks/useLocale.ts';

export default function App() {
    const content = useRoutes(router);
    const locale = useLocale();
    const theme = useTheme();
    const localeTheme = useMemo(() => createTheme(theme, locale), [locale, theme]);
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
