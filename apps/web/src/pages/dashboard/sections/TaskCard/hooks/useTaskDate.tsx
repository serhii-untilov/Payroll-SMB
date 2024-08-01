import { Locale } from '@/context/LocaleContext';
import useLocale from '@/hooks/context/useLocale';
import { Task } from '@repo/openapi';
import { useMemo } from 'react';

export default function useTaskDate(task: Task) {
    const { locale } = useLocale();

    const getTaskDate = (task: Task, locale: Locale) => {
        {
            const day = task.dateFrom.getDate();
            const month = task.dateFrom.toLocaleString(locale.dateLocale.code, {
                month: 'short',
            });
            return `${day} ${month}`;
        }
    };

    return useMemo(() => getTaskDate(task, locale), [task, locale]);
}
