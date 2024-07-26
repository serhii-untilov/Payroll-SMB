import { useLocale } from '@/hooks/useLocale';
import { Person, Task } from '@repo/openapi';
import { useMemo } from 'react';
import TaskCard from '../../TaskCard';
import { getTaskDate } from '../../TaskCard/hooks/useTask';
import useDescription from './hooks/useDescription';

type HappyBirthdayTaskProps = {
    task: Task;
    person: Person;
};

const HappyBirthdayCard = ({ task, person }: HappyBirthdayTaskProps) => {
    const { locale } = useLocale();
    const description = useDescription(task, person);
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    return <TaskCard task={task} date={taskDate} description={description} />;
};

export default HappyBirthdayCard;
