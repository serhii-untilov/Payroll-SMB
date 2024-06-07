import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { Loading } from '../../../components/utility/Loading';
import { ReminderTask } from './ReminderTask';
import { add } from 'date-fns';
import { ITask, TaskType, dropTime } from '@repo/shared';
import { useMemo } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';
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
            <Typography component="h3" variant="h3" textAlign={'center'}>
                {t('Reminders')}
            </Typography>
            {taskList.map((task) => (
                <Task task={task} view="reminder" />
            ))}
        </Box>
    ) : null;
}
