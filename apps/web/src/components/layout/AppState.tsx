import { CheckCircle } from '@mui/icons-material';
import { Box, CircularProgress, CircularProgressProps, IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { BaseVariant, enqueueSnackbar } from 'notistack';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';
import { Tooltip } from './Tooltip';
import { ServerEvent } from '@repo/shared';

type Props = CircularProgressProps & PropsWithChildren;

export function AppState(props: Props) {
    const { t } = useTranslation();
    const { serverEvent: event } = useAppContext();
    const navigate = useNavigate();

    const state = useMemo(() => {
        return !event
            ? 'success'
            : event.includes('started')
              ? 'warning'
              : event.includes('finished')
                ? 'success'
                : event.includes('failed')
                  ? 'error'
                  : 'info';
    }, [event]);

    const onButtonClick = () => {
        navigate('/dashboard');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="bottom" title={t(event || ServerEvent.PAYROLL_FINISHED)}>
                {!event || event.includes('finished') ? (
                    <IconButton
                        size="small"
                        color={state}
                        onClick={() => {
                            onButtonClick();
                        }}
                    >
                        <CheckCircle />
                    </IconButton>
                ) : (
                    <CircularProgress size={34} thickness={5} color={state} />
                )}
            </Tooltip>
        </Box>
    );
}

function getSnackbarVariant(event: string): BaseVariant {
    if (event.includes('error')) return 'error';
    if (event.includes('failed')) return 'error';
    if (event.includes('finished')) return 'success';
    if (event.includes('started')) return 'info';
    if (!event) return 'success';
    return 'info';
}
