import { Box, Button, Grid, Typography } from '@mui/material';
import { amber } from '@mui/material/colors';
import { ITask, formatDate } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { IEvent } from './Reminder';

type Props = {
    event: IEvent;
};

export function ReminderEvent(props: Props) {
    const { event: event } = props;
    const { t } = useTranslation();

    return (
        <Box
            // boxShadow={1}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 1,
                py: 1,
                px: 3,
                borderRadius: 2,
                bgcolor: amber[50],
            }}
        >
            <Grid container flexDirection="column" alignItems="start">
                <Grid item>
                    <Typography sx={{ fontWeight: 'medium' }}>
                        {t(formatDate(event.date))}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography>{t(event.description)}</Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
