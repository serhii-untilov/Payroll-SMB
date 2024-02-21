import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App.tsx';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const defaultTheme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <CssBaseline enableColorScheme />
                    <ThemeProvider theme={defaultTheme}>
                        <LocaleProvider>
                            <SnackbarProvider
                                maxSnack={3}
                                preventDuplicate
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <App />
                            </SnackbarProvider>
                        </LocaleProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
