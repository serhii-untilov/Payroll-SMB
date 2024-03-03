import { useTheme } from '@emotion/react';
import { IconButton, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import useLocale from './hooks/useLocale.ts';
import './index.css';
import router from './router/router';
import { useTranslation } from 'react-i18next';
import Close from '@mui/icons-material/Close';
import { AppProvider } from './context/AppContext.tsx';

export default function App() {
    const content = useRoutes(router);

    return (
        <>
            <CssBaseline enableColorScheme />
            <SnackbarProvider
                maxSnack={5}
                preventDuplicate
                hideIconVariant
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                action={(snackbarId) => (
                    <IconButton
                        sx={{ color: 'white' }}
                        onClick={() => closeSnackbar(snackbarId)}
                        aria-label="close"
                    >
                        <Close fontSize="small" />
                    </IconButton>
                )}
            >
                <AppProvider>{content}</AppProvider>
            </SnackbarProvider>
        </>
    );
}
