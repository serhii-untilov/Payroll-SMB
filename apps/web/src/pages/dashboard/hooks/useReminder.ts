import { Task, TaskType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useMemo } from 'react';

export const typeList: TaskType[] = [TaskType.HappyBirthday];

export default function useReminder(taskList: Task[]) {
    const onDate = dateUTC(new Date());
    return useMemo(
        () =>
            taskList
                ?.filter((o) => o.dateFrom.getTime() <= onDate.getTime())
                .filter((o) => typeList.includes(o.type)),
        [taskList, onDate],
    );
}
