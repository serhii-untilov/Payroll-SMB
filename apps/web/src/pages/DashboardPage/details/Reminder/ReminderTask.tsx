import { Task } from '@repo/openapi';
import TaskCard from '../TaskCard';
import { useMemo } from 'react';
import { getTaskDate } from '../TaskCard/hooks/useTask';
import useLocale from '@/hooks/useLocale';

type ReminderTaskProps = {
    task: Task;
};

const ReminderTask = ({ task }: ReminderTaskProps) => {
    const { locale } = useLocale();
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    return <TaskCard task={task} date={taskDate} />;
};

export default ReminderTask;
