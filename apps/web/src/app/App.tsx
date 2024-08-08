import AppSnackbarProvider from '@/components/SnackBarProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { useRoutes } from 'react-router-dom';
import router from '../router/router';
import './../index.css';
import useApp from './App.hooks';

export default function App() {
    const content = useRoutes(router);
    useApp();
    return (
        <>
            <CssBaseline enableColorScheme />
            <AppSnackbarProvider>{content}</AppSnackbarProvider>
        </>
    );
}
