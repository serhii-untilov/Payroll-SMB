import { Task, TaskType } from '@repo/openapi';

export const typeList: TaskType[] = [TaskType.HappyBirthday];

const useReminder = (taskList: Task[]) => {
    const onDate = new Date();
    return taskList
        ?.filter((o) => o.dateFrom.getTime() <= onDate.getTime())
        .filter((o) => typeList.includes(o.type));
};

export default useReminder;
