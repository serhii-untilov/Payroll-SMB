import { Box } from '@mui/system';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '@/components/TaskListTitle';
import TodoTask from './TodoTask';

const TodoList = ({ taskList }) => {
    const { t } = useTranslation();
    return (
        <Box>
            <TaskListTitle title={t('Things to do')} />
            {taskList.map((task: Task) => (
                <TodoTask key={task.id} task={task} />
            ))}
        </Box>
    );
};

export default TodoList;
