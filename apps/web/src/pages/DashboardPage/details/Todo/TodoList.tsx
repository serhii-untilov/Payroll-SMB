import { Box } from '@mui/system';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import TaskListTitle from '../TaskListTitle';
import TodoTask from './TodoTask';

type TodoListProps = {
    taskList: Task[];
};

export function TodoList(props: TodoListProps) {
    const { t } = useTranslation();

    return (
        <Box>
            <TaskListTitle title={t('Things to do')} />
            {props.taskList.map((task) => (
                <TodoTask key={task.id} task={task} />
            ))}
        </Box>
    );
}
