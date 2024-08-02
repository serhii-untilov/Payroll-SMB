import useTaskDate from '@/hooks/useTaskDate';
import TaskCard from '../task-card/TaskCard';

const ReminderTask = ({ task }) => {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
};

export default ReminderTask;
