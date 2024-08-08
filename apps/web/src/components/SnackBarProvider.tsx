import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { PropsWithChildren } from 'react';

const AppSnackbarProvider = ({ children }: PropsWithChildren) => {
    return (
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
            {children}
        </SnackbarProvider>
    );
};

export default AppSnackbarProvider;
