import { Task } from '@repo/openapi';
import TaskCard from '../TaskCard';
import useTaskDate from '../TaskCard/hooks/useTaskDate';

type ReminderTaskProps = {
    task: Task;
};

export default function ReminderTask({ task }: ReminderTaskProps) {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
}
