import { Box } from '@mui/system';
import { Task, TaskType } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '../TaskListTitle';
import HappyBirthdayTask from './happy-birthday/HappyBirthdayTask';
import ReminderTask from './ReminderTask';

type ReminderListProps = {
    taskList: Task[];
};

export function ReminderList(props: ReminderListProps) {
    const { t } = useTranslation();

    return (
        <Box>
            <TaskListTitle title={t('Reminders')} />
            {props.taskList.map((task) =>
                task.type === TaskType.HappyBirthday && task.entityId ? (
                    <HappyBirthdayTask key={task.id} task={task} personId={task.entityId} />
                ) : (
                    <ReminderTask key={task.id} task={task} />
                ),
            )}
        </Box>
    );
}
