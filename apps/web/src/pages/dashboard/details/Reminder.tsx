import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TaskType } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from '@repo/openapi';

type Props = {
    taskList: Task[];
};

export function Reminder(props: Props) {
    const { t } = useTranslation();
    const typeList = useMemo(() => [TaskType.HAPPY_BIRTHDAY.toString()], []);
    const taskList: Task[] = useMemo(
        () => props.taskList.filter((o) => typeList.includes(o.type)),
        [props, typeList],
    );

    return taskList.length ? (
        <Box>
            <Typography component="h4" variant="h4" textAlign={'center'}>
                {t('Reminders')}
            </Typography>
            {taskList.map((task) => (
                <Task key={task.id} task={task} view="reminder" />
            ))}
        </Box>
    ) : null;
}
