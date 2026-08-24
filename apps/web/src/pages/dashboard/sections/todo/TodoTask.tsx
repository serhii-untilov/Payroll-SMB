import { Task } from '@repo/openapi';
import TaskCard from '../task-card/TaskCard';

const TodoTask = ({ task }: { task: Task }) => {
    return <TaskCard task={task} />;
};

export default TodoTask;
