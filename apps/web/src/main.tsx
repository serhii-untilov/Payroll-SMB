import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import './index.css';
import './services/i18n/i18n.ts';
import queryClient from './services/query/queryClient.ts';
import { store } from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <StoreProvider store={store}>
                            <LocaleProvider>
                                <App />
                            </LocaleProvider>
                        </StoreProvider>
                    </BrowserRouter>
                </AuthProvider>
            </QueryClientProvider>
        </AppErrorBoundary>
    </React.StrictMode>,
);
