import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ITask, TaskType } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from './Task';

type Props = {
    taskList: ITask[];
};

export function Reminder(props: Props) {
    const { t } = useTranslation();
    const typeList = useMemo(() => [TaskType.HAPPY_BIRTHDAY.toString()], []);
    const taskList: ITask[] = useMemo(
        () =>
            props.taskList
                // ?.filter((o) => dropTime(o.dateFrom) <= dropTime(new Date()))
                .filter((o) => typeList.includes(o.type)),
        [props, typeList],
    );

    return taskList.length ? (
        <Box>
            <Typography component="h4" variant="h4" textAlign={'center'}>
                {t('Reminders')}
            </Typography>
            {taskList.map((task) => (
                <Task task={task} view="reminder" />
            ))}
        </Box>
    ) : null;
}
