import { ICreateTask, IFindTask, ITask, IUpdateTask } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createTask(task: ICreateTask): Promise<ITask> {
    const response = await api.post(`/api/tasks/`, task, { headers: authHeader() });
    return response.data;
}

export async function getTaskList(params: IFindTask): Promise<ITask[]> {
    const response = await api.post('/api/tasks/find', params, { headers: authHeader() });
    return response.data;
}

export async function getTask(params: {
    id: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date | null | undefined;
}): Promise<ITask> {
    const response = await api.get(
        `/api/tasks/${params.id}?relations=${!!params.relations}` +
            (params.onDate ? `&onDate=${params.onDate}` : '') +
            (params.onPayPeriodDate ? `&onPayPeriodDate=${params.onPayPeriodDate}` : ''),
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function updateTask(id: number, task: IUpdateTask): Promise<ITask> {
    const response = await api.patch(`/api/tasks/${id}`, task, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deleteTask(id: number): Promise<ITask> {
    const response = await api.delete(`/api/tasks/${id}`, { headers: authHeader() });
    return response.data;
}
