import { useMemo } from 'react';
import { Task } from '@repo/openapi';
import { todoTaskTypeList } from './useTodo';
import { dateUTC } from '@repo/shared';

const useUpcoming = (taskList: Task[]) => {
    const onDate = dateUTC(new Date());
    return useMemo(
        () =>
            taskList
                ?.filter((o) => o.dateFrom.getTime() > onDate.getTime())
                .filter((o) => todoTaskTypeList.includes(o.type)),
        [taskList, onDate],
    );
};

export default useUpcoming;
