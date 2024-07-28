import useLocale from '@/hooks/useLocale';
import { Task } from '@repo/openapi';
import { useMemo } from 'react';
import TaskCard from '../TaskCard';
import { getTaskDate } from '../TaskCard/hooks/useTask';

type ReminderTaskProps = {
    task: Task;
};

export default function ReminderTask({ task }: ReminderTaskProps) {
    const { locale } = useLocale();
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    return <TaskCard task={task} date={taskDate} />;
}
