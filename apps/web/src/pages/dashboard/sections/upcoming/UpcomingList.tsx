import { Box } from '@mui/material';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '@/components/TaskListTitle';
import UpcomingTask from './UpcomingTask';

const UpcomingList = ({ taskList }) => {
    const { t } = useTranslation();
    return (
        <Box>
            <TaskListTitle title={t('Upcoming')} />
            {taskList.map((task: Task) => (
                <UpcomingTask key={task.id} task={task} />
            ))}
        </Box>
    );
};

export default UpcomingList;
