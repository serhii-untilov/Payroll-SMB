import { api } from '@/api';
import {
    CreateDepartmentDto,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    UpdateDepartmentDto,
} from '@repo/openapi';

export async function departmentsCreate(payload: CreateDepartmentDto) {
    return (await api.departmentsCreate(payload)).data;
}

export async function departmentsFindAll(params: FindAllDepartmentDto) {
    const response = (await api.departmentsFindAll(params)).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function departmentsFindOne(id: number, params?: FindOneDepartmentDto) {
    return (await api.departmentsFindOne(id, params ?? {})).data;
}

export async function departmentsUpdate(id: number, payload: UpdateDepartmentDto) {
    return (await api.departmentsUpdate(id, payload)).data;
}

export async function departmentsRemove(id: number) {
    return (await api.departmentsRemove(id)).data;
}
