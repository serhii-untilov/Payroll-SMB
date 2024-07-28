import { Task } from '@repo/openapi';
import TaskCard from '../TaskCard';

type TodoTaskProps = {
    task: Task;
};

export default function TodoTask({ task }: TodoTaskProps) {
    return <TaskCard task={task} />;
}
