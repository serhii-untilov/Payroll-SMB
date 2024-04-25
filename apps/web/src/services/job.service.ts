import { IJob, ICreateJob, IUpdateJob } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createJob(job: ICreateJob): Promise<IJob> {
    const response = await api.post(`/api/jobs/`, job, { headers: authHeader() });
    return response.data;
}

export async function getJobList(): Promise<IJob[]> {
    const response = await api.get(`/api/jobs/`, { headers: authHeader() });
    return response.data.sort((a: IJob, b: IJob) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getJob(id: number): Promise<IJob> {
    const response = await api.get(`/api/jobs/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateJob(id: number, job: IUpdateJob): Promise<IJob> {
    const response = await api.patch(`/api/jobs/${id}`, job, { headers: authHeader() });
    return response.data;
}

export async function deleteJob(id: number): Promise<IJob> {
    const response = await api.delete(`/api/jobs/${id}`, { headers: authHeader() });
    return response.data;
}
