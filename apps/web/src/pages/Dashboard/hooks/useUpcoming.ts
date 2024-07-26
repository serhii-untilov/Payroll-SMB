import { Task } from '@repo/openapi';
import { todoTaskTypeList } from './useTodo';

const useUpcoming = (taskList: Task[]) => {
    const onDate = new Date();
    return taskList
        ?.filter((o) => o.dateFrom.getTime() > onDate.getTime())
        .filter((o) => todoTaskTypeList.includes(o.type));
};

export default useUpcoming;
