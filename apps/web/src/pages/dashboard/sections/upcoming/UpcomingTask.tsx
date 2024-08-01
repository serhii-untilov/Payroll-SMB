import useTaskDate from '../../hooks/useTaskDate';
import TaskCard from '../task-card/TaskCard';

const UpcomingTask = ({ task }) => {
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} />;
};

export default UpcomingTask;
