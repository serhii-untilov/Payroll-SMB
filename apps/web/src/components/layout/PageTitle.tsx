import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState } from './AppState';

type Props = PropsWithChildren & {
    goBack?: boolean;
};

export function PageTitle(props: Props) {
    const { goBack, children, ...other } = props;
    const navigate = useNavigate();

    const onGoBack = () => {
        navigate(-1);
    };
    return (
        // <Box sx={{ height: 48, display: 'flex', alignItems: 'center' }}>
        <Box
            id="page-title"
            sx={{
                height: 48,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Typography component="h2" color="primary.main" variant="h2" noWrap {...other}>
                {goBack && (
                    <IconButton
                        aria-label="Go Back"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={onGoBack}
                    >
                        <ArrowBackIosNewRounded />
                    </IconButton>
                )}
                {children}
            </Typography>
            <AppState id="app-state" />
        </Box>
    );
}
