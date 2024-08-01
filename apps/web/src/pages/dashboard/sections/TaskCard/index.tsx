import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { Box, Grid, IconButton } from '@mui/material';
import { ResourceType, Task, TaskStatus } from '@repo/openapi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TaskDate from './TaskDate';
import TaskDescription from './TaskDescription';
import TaskTitle from './TaskTitle';
import useStatusIcon from './hooks/useStatusIcon';
import { useTask } from './hooks/useTask';

interface TaskCardProps {
    task: Task;
    date?: string;
    description?: string;
}

export default function TaskCard(props: TaskCardProps) {
    const { date, description } = props;
    const [task, setTask] = useState<Task>(props.task);
    const { title, path, bgColor, toggleStatus } = useTask(task);
    const navigate = useNavigate();
    const statusIcon = useStatusIcon(task);
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();

    const onTaskClick = () => {
        if (task.status === TaskStatus.NotAvailable) return;
        if (path) navigate(path);
    };

    const onStatusClick = async () => {
        const updatedTask = await toggleStatus();
        if (updatedTask) {
            setTask(updatedTask);
            await invalidateQueries([ResourceType.Task]);
        } else {
            onTaskClick();
        }
    };

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
