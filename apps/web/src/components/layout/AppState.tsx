import { useAppContext } from '@/hooks/useAppContext';
import { CheckCircle } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';
import { ServerEvent } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from './Tooltip';

export function AppState() {
    const { t } = useTranslation();
    const { serverEvent: event } = useAppContext();
    const navigate = useNavigate();

    const color = useMemo(() => {
        return event.includes('failed') || event.includes('error') ? 'error' : 'primary';
    }, [event]);

    const onButtonClick = () => {
        navigate('/dashboard');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="bottom" title={t(event ?? ServerEvent.PayrollFinished)}>
                {!event || event.includes('finished') ? (
                    <IconButton
                        size="small"
                        color={color}
                        onClick={() => {
                            onButtonClick();
                        }}
                    >
                        <CheckCircle />
                    </IconButton>
                ) : (
                    <CircularProgress
                        onClick={() => {
                            onButtonClick();
                        }}
                        size={34}
                        thickness={3}
                        color={color}
                    />
                )}
            </Tooltip>
        </Box>
    );
}
