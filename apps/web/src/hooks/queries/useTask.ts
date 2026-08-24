import { api } from '@/api';
import { CreateTaskDto, FindAllTaskDto, FindOneTaskDto, Resource, Task, UpdateTaskDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetTaskList = (params: FindAllTaskDto) => {
    return useQuery<Task[], Error>({
        queryKey: [Resource.Task, params],
        queryFn: async () => (await api.tasksFindAll(params)).data,
    });
};

const useGetTask = (taskId: string, params?: FindOneTaskDto) => {
    return useQuery<Task, Error>({
        queryKey: [Resource.Task, { taskId, params }],
        queryFn: async () => (await api.tasksFindOne(taskId, params ?? {})).data,
        enabled: !!taskId,
    });
};

const useCreateTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateTaskDto): Promise<Task> => (await api.tasksCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Task, Resource.PayPeriod]);
        },
    });
};

type UpdateTask = {
    id: string;
    version: number;
    dto: UpdateTaskDto;
};

type RemoveTask = {
    id: string;
    version: number;
};

const useUpdateTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdateTask): Promise<Task> =>
            (await api.tasksUpdate(id, version, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Task, Resource.PayPeriod, Resource.Position]);
        },
    });
};

const useRemoveTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemoveTask) => (await api.tasksRemove(id, version)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.Task,
                Resource.PayPeriod,
                Resource.Department,
                Resource.Position,
                Resource.Task,
            ]);
        },
    });
};

export { useCreateTask, useGetTask, useGetTaskList, useUpdateTask, useRemoveTask };
