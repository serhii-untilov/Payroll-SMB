import Close from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { useRoutes } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext.tsx';
import './../index.css';
import router from '../router/router';

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
