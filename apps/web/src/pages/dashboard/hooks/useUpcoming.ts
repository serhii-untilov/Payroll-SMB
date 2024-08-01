import { Task } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useMemo } from 'react';
import { todoTaskTypeList } from './useTodo';

export default function useUpcoming(taskList: Task[]) {
    const onDate = dateUTC(new Date());
    return useMemo(
        () =>
            taskList
                ?.filter((o) => o.dateFrom.getTime() > onDate.getTime())
                .filter((o) => todoTaskTypeList.includes(o.type)),
        [taskList, onDate],
    );
}
