import AppSnackbarProvider from '@/components/SnackBarProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { useRoutes } from 'react-router-dom';
import router from '../router/router';
import './../index.css';
import useApp from './App.hooks';
import { ThemeProvider } from '@mui/material';

export default function App() {
    const { theme } = useApp();
    const content = useRoutes(router);
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <AppSnackbarProvider>{content}</AppSnackbarProvider>
            </ThemeProvider>
        </>
    );
}
