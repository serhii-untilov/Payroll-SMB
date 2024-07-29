import useLocale from '@/hooks/context/useLocale';
import { Task } from '@repo/openapi';
import { useMemo } from 'react';
import TaskCard from '../TaskCard';
import { getTaskDate } from '../TaskCard/hooks/useTask';

type UpcomingTaskProps = {
    task: Task;
};

export default function UpcomingTask({ task }: UpcomingTaskProps) {
    const { locale } = useLocale();
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    return <TaskCard task={task} date={taskDate} />;
}
