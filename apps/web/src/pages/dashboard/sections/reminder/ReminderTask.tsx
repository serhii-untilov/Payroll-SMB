import { Task } from '@repo/openapi';
import TaskCard from '../task-card/TaskCard';
import useTaskDate from '../../hooks/useTaskDate';

type ReminderTaskProps = {
    task: Task;
};

export default function ReminderTask({ task }: ReminderTaskProps) {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
}
