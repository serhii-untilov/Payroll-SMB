import { ComponentProps, ErrorInfo, PropsWithChildren } from 'react';
import { ErrorBoundary, FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Typography } from '@mui/material';

function ErrorFallback(props: FallbackProps) {
    const { error, resetErrorBoundary } = props;
    const { resetBoundary } = useErrorBoundary();
    // const navigate = useNavigate();

    return (
        <div role="alert">
            <h1 style={{ margin: '1rem' }}>Something went wrong</h1>
            <h4 style={{ color: 'red', margin: '1rem' }}>{error.message}</h4>
            <button
                style={{
                    margin: '1rem',
                    fontSize: 16,
                    height: '2rem',
                    width: '8rem',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fff',
                    backgroundColor: '#1565c0',
                }}
                onClick={() => {
                    resetBoundary();
                    // navigate(-1);
                }}
            >
                Try again
            </button>
        </div>
    );
}

function logError(error: Error, info: ErrorInfo) {
    console.log(error.message);
}

export function AppErrorBoundary(props: PropsWithChildren) {
    const { children } = props;
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
            {children}
        </ErrorBoundary>
    );
}
