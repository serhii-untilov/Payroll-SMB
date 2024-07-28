import { Task } from '@repo/openapi';
import TaskCard from '../TaskCard';

type TodoTaskProps = {
    task: Task;
};

const TodoTask = ({ task }: TodoTaskProps) => {
    return <TaskCard task={task} />;
};

export default TodoTask;
