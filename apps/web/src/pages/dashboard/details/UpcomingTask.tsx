import { Box, Button, Typography } from '@mui/material';
import { amber } from '@mui/material/colors';
import { ITask } from '@repo/shared';
import { useTranslation } from 'react-i18next';

type Props = {
    task: ITask;
};

export function UpcomingTask(props: Props) {
    const { task } = props;
    const { t } = useTranslation();

    return (
        <Box
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
            <Box>
                <Typography>{t(task.type)}</Typography>
                {/* <Typography>{t(task.status)}</Typography> */}
            </Box>
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button size="small">Перейти до виконання</Button>
                <Button size="small" color="success">
                    Позначити виконаним
                </Button>
            </Box> */}
        </Box>
    );
}
