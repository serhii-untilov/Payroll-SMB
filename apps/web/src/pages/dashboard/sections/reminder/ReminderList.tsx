import { Box } from '@mui/system';
import { Task, TaskType } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '@/components/TaskListTitle';
import HappyBirthdayTask from './happy-birthday/HappyBirthdayTask';
import ReminderTask from './ReminderTask';

const ReminderList = ({ taskList }) => {
    const { t } = useTranslation();
    return (
        <Box>
            <TaskListTitle title={t('Reminders')} />
            {taskList.map((task: Task) =>
                task.type === TaskType.HappyBirthday && task.entityId ? (
                    <HappyBirthdayTask key={task.id} task={task} personId={task.entityId} />
                ) : (
                    <ReminderTask key={task.id} task={task} />
                ),
            )}
        </Box>
    );
};

export default ReminderList;
