import { api } from '@/api';
import {
    CreateDepartmentDto,
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    UpdateDepartmentDto,
} from '@repo/openapi';

export async function departmentsCreate(payload: CreateDepartmentDto): Promise<Department> {
    return (await api.departmentsCreate(payload)).data;
}

export async function departmentsFindAll(params: FindAllDepartmentDto): Promise<Department[]> {
    const response = await api.departmentsFindAll(params);
    return response.data.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function departmentsFindOne(
    id: number,
    params?: FindOneDepartmentDto,
): Promise<Department> {
    return (await api.departmentsFindOne(id, params ?? {})).data;
}

export async function departmentsUpdate(
    id: number,
    payload: UpdateDepartmentDto,
): Promise<Department> {
    return (await api.departmentsUpdate(id, payload)).data;
}

export async function departmentsRemove(id: number): Promise<Department> {
    return (await api.departmentsRemove(id)).data;
}
