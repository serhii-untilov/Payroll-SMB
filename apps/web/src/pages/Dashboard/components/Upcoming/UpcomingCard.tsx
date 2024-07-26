import { Box } from '@mui/material';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskComponent from '../TaskComponent';
import TaskListTitle from '../TaskListTitle';

type Props = {
    taskList: Task[];
};

export default function UpcomingCard(props: Props) {
    const { t } = useTranslation();
    return (
        <Box>
            <TaskListTitle title={t('Upcoming')} />
            {props.taskList.map((task) => (
                <TaskComponent key={task.id} task={task} view="upcoming" />
            ))}
        </Box>
    );
}
