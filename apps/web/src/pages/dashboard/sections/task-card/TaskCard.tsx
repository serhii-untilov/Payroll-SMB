import { Box, Grid, IconButton } from '@mui/material';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import useTaskCard from './TaskCard.hooks';
import TaskDate from '@/components/TaskDate';
import TaskDescription from '@/components/TaskDescription';
import TaskTitle from '@/components/TaskTitle';

interface TaskCardProps {
    task: Task;
    date?: string;
    description?: string;
}

export default function TaskCard(props: TaskCardProps) {
    const { date, description } = props;
    const { task, title, statusIcon, bgColor, onTaskClick, onStatusClick } = useTaskCard({
        task: props.task,
    });

    const { t } = useTranslation();

    return (
        <Box
            id={`task-id-${task.id}`}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 1,
                py: 1,
                pl: 1,
                pr: 3,
                borderRadius: 2,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : bgColor),
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid grey' : ''),
            }}
        >
            <Grid
                item
                xs={11}
                component={'button'}
                onClick={() => onTaskClick()}
                sx={{ border: 0, bgcolor: 'inherit', textAlign: 'left', cursor: 'pointer' }}
            >
                <Grid container>
                    {date && <TaskDate date={date} />}
                    <Grid item xs={9} sx={{ ml: 1 }}>
                        <TaskTitle title={title} />
                        <TaskDescription description={description ?? t(task.type)} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1}>
                {statusIcon && (
                    <IconButton onClick={() => onStatusClick()}>{statusIcon}</IconButton>
                )}
            </Grid>
        </Box>
    );
}
