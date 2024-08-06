import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import './services/i18n/i18n.ts';
import './index.css';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: true,
            staleTime: 5 * 60 * 1000,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppErrorBoundary>
            <ReduxProvider store={store}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <BrowserRouter>
                            <LocaleProvider>
                                <App />
                            </LocaleProvider>
                        </BrowserRouter>
                    </AuthProvider>
                </QueryClientProvider>
            </ReduxProvider>
        </AppErrorBoundary>
    </React.StrictMode>,
);
