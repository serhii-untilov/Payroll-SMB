import { CheckCircle } from '@mui/icons-material';
import { Box, CircularProgress, CircularProgressProps, IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { BaseVariant, enqueueSnackbar } from 'notistack';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useServerCompanyEvents } from '../../hooks/useServerCompanyEvents';
import { Tooltip } from './Tooltip';

type Props = CircularProgressProps & PropsWithChildren;

export function AppState(props: Props) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isOnline = useOnlineStatus();
    const { company } = useAppContext();
    const { event } = useServerCompanyEvents(company?.id || 0);
    const navigate = useNavigate();

    const state = useMemo(() => {
        return !isOnline
            ? 'error'
            : event.includes('started')
              ? 'warning'
              : event.includes('finished')
                ? 'success'
                : event.includes('failed')
                  ? 'error'
                  : 'info';
    }, [event, isOnline]);

    useEffect(() => {
        const invalidateQueries = async () => {
            // const keys = ['company', 'position', 'payPeriod', 'task'];
            // for (const key of keys) {
            //     await queryClient.invalidateQueries({
            //         queryKey: [key],
            //         refetchType: 'all',
            //     });
            // }
            await queryClient.invalidateQueries();
            console.log('Queries made invalidated');
        };
        if (!isOnline) {
            enqueueSnackbar(`${t('OffLine')}`, { variant: getSnackbarVariant(event) });
        } else if (event) {
            if (event.includes('finished')) {
                invalidateQueries();
                // enqueueSnackbar(`${t(event)}`, { variant: getSnackbarVariant(event) });
            }
            if (event.includes('failed') || event.includes('error')) {
                enqueueSnackbar(`${t(event)}`, { variant: getSnackbarVariant(event) });
            }
        }
    }, [event, queryClient, t, isOnline]);

    const onButtonClick = () => {
        navigate('/dashboard');
    };

    return event ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="bottom" title={t(!isOnline ? 'Offline' : event)}>
                {event.includes('finished') ? (
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
    ) : null;
}

function getSnackbarVariant(event: string): BaseVariant {
    if (event.includes('error')) return 'error';
    if (event.includes('failed')) return 'error';
    if (event.includes('finished')) return 'success';
    if (event.includes('started')) return 'info';
    return 'info';
}
