import { Box } from '@mui/material';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '../TaskListTitle';
import UpcomingTask from './UpcomingTask';

type UpcomingListProps = {
    taskList: Task[];
};

export default function UpcomingList(props: UpcomingListProps) {
    const { t } = useTranslation();
    return (
        <Box>
            <TaskListTitle title={t('Upcoming')} />
            {props.taskList.map((task) => (
                <UpcomingTask key={task.id} task={task} />
            ))}
        </Box>
    );
}
