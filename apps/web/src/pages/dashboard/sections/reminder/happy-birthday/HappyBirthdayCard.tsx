import useHappyBirthdayDescription from '@/hooks/useHappyBirthdayDescription';
import useTaskDate from '@/hooks/useTaskDate';
import TaskCard from '../../task-card/TaskCard';

const HappyBirthdayCard = ({ task, person }) => {
    const description = useHappyBirthdayDescription(task, person);
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} description={description} />;
};

export default HappyBirthdayCard;
