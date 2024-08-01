import { Task } from '@repo/openapi';
import TaskCard from '../TaskCard';
import useTaskDate from '../TaskCard/hooks/useTaskDate';

type UpcomingTaskProps = {
    task: Task;
};

export default function UpcomingTask({ task }: UpcomingTaskProps) {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
}
