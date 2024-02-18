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
            <BrowserRouter>
                <CssBaseline enableColorScheme />
                <ThemeProvider theme={defaultTheme}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
