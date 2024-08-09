import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { selectServerEvent } from '@/store/slices/serverEventSlice';
import { useAppSelector } from '@/store/store.hooks';
import { snackbarWarning } from '@/utils/snackbar';
import { CheckCircle } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { ServerEvent } from '@repo/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from './layout/Tooltip';

const AppState = () => {
    const { t } = useTranslation();
    const event = useAppSelector(selectServerEvent);
    const navigate = useNavigate();
    const isOnline = useOnlineStatus();

    useEffect(() => {
        if (!isOnline) {
            snackbarWarning({ message: t('Offline') });
        }
    }, [isOnline, t]);

    const color = useMemo(() => {
        return event.includes('failed') || event.includes('error')
            ? 'error'
            : isOnline
              ? 'primary'
              : 'warning';
    }, [event, isOnline]);

    const onButtonClick = useCallback(() => navigate('/dashboard'), [navigate]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="bottom" title={t(event ?? ServerEvent.PayrollFinished)}>
                {!event || event.includes('finished') ? (
                    <IconButton size="small" color={color} onClick={onButtonClick}>
                        <CheckCircle />
                    </IconButton>
                ) : (
                    <CircularProgress
                        onClick={onButtonClick}
                        size={34}
                        thickness={3}
                        color={color}
                    />
                )}
            </Tooltip>
        </Box>
    );
};

export { AppState };
