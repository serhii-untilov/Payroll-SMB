import { api } from '@/api';
import { CreateTaskDto, FindAllTaskDto, FindOneTaskDto, UpdateTaskDto } from '@repo/openapi';

export async function tasksCreate(task: CreateTaskDto) {
    return (await api.tasksCreate(task)).data;
}

export async function tasksFindAll(params: FindAllTaskDto) {
    return (await api.tasksFindAll(params)).data;
}

export async function tasksFindOne(id: number, params?: FindOneTaskDto) {
    return await api.tasksFindOne(id, params ?? {});
}

export async function tasksUpdate(id: number, payload: UpdateTaskDto) {
    return (await api.tasksUpdate(id, payload)).data;
}

export async function tasksRemove(id: number) {
    return await api.tasksRemove(id);
}
