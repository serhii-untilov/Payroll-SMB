import useLocale from '@/hooks/context/useLocale';
import { Task } from '@repo/openapi';
import { useMemo } from 'react';

export default function useTaskDate(task: Task) {
    const { locale } = useLocale();
    return useMemo(() => {
        const day = task.dateFrom.getDate();
        const month = task.dateFrom.toLocaleString(locale.dateLocale.code, {
            month: 'short',
        });
        return `${day} ${month}`;
    }, [task, locale]);
}
