import useTaskDate from '@/hooks/useTaskDate';
import { Task } from '@repo/openapi';
import TaskCard from '../task-card/TaskCard';

const ReminderTask = ({ task }: { task: Task }) => {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
};

export default ReminderTask;
