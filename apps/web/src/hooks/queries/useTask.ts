import { api } from '@/api';
import {
    CreateTaskDto,
    FindAllTaskDto,
    FindOneTaskDto,
    ResourceType,
    Task,
    UpdateTaskDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetTaskList = (params: FindAllTaskDto) => {
    return useQuery<Task[], Error>({
        queryKey: [ResourceType.Task, params],
        queryFn: async () => (await api.tasksFindAll(params)).data,
    });
};

const useGetTask = (taskId: number, params?: FindOneTaskDto) => {
    return useQuery<Task, Error>({
        queryKey: [ResourceType.Task, { taskId, params }],
        queryFn: async () => (await api.tasksFindOne(taskId, params ?? {})).data,
        enabled: !!taskId,
    });
};

const useCreateTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateTaskDto): Promise<Task> => (await api.tasksCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Task, ResourceType.PayPeriod]);
        },
    });
};

type UpdateTask = {
    id: number;
    dto: UpdateTaskDto;
};

const useUpdateTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateTask): Promise<Task> =>
            (await api.tasksUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Task, ResourceType.PayPeriod, ResourceType.Position]);
        },
    });
};

const useRemoveTask = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.tasksRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Task,
                ResourceType.PayPeriod,
                ResourceType.Department,
                ResourceType.Position,
                ResourceType.Task,
            ]);
        },
    });
};

export { useCreateTask, useGetTask, useGetTaskList, useUpdateTask, useRemoveTask };
