import { Box } from '@mui/system';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskComponent from '../TaskComponent';
import TaskListTitle from '../TaskListTitle';

type Props = {
    taskList: Task[];
};

export function ReminderCard(props: Props) {
    const { t } = useTranslation();

    return (
        <Box>
            <TaskListTitle title={t('Reminders')} />
            {props.taskList.map((task) => (
                <TaskComponent key={task.id} task={task} view="reminder" />
            ))}
        </Box>
    );
}
