import { useMemo } from 'react';
import { Task, TaskType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';

export const typeList: TaskType[] = [TaskType.HappyBirthday];

const useReminder = (taskList: Task[]) => {
    const onDate = dateUTC(new Date());
    return useMemo(
        () =>
            taskList
                ?.filter((o) => o.dateFrom.getTime() <= onDate.getTime())
                .filter((o) => typeList.includes(o.type)),
        [taskList, onDate],
    );
};

export default useReminder;
