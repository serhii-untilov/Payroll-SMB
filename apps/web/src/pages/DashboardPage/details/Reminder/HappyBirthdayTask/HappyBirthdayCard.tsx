import useLocale from '@/hooks/context/useLocale';
import { Person, Task } from '@repo/openapi';
import { useMemo } from 'react';
import TaskCard from '../../TaskCard';
import { getTaskDate } from '../../TaskCard/hooks/useTask';
import useDescription from './hooks/useDescription';

type HappyBirthdayTaskProps = {
    task: Task;
    person: Person;
};

export default function HappyBirthdayCard({ task, person }: HappyBirthdayTaskProps) {
    const { locale } = useLocale();
    const description = useDescription(task, person);
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    return <TaskCard task={task} date={taskDate} description={description} />;
}