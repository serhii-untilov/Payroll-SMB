import { Person, Task } from '@repo/openapi';
import TaskCard from '../../TaskCard';
import useTaskDate from '../../TaskCard/hooks/useTaskDate';
import useHappyBirthdayDescription from '../../../hooks/useHappyBirthdayDescription';

type HappyBirthdayTaskProps = {
    task: Task;
    person: Person;
};

export default function HappyBirthdayCard({ task, person }: HappyBirthdayTaskProps) {
    const description = useHappyBirthdayDescription(task, person);
    const taskDate = useTaskDate(task);
    return <TaskCard task={task} date={taskDate} description={description} />;
}
