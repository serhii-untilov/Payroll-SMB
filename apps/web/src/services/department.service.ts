import { IDepartment, ICreateDepartment, IUpdateDepartment } from '@repo/shared';
import { axiosInstance } from '../api';
import authHeader from './auth-header';

export async function createDepartment(department: ICreateDepartment): Promise<IDepartment> {
    const response = await axiosInstance.post(`/api/departments/`, department, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getDepartmentList(
    companyId: number,
    relations: boolean = false,
): Promise<IDepartment[]> {
    const response = await axiosInstance.get(
        `/api/departments/?companyId=${companyId}&relations=${relations}`,
        {
            headers: authHeader(),
        },
    );
    return response.data.sort((a: IDepartment, b: IDepartment) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getDepartment(id: number): Promise<IDepartment> {
    const response = await axiosInstance.get(`/api/departments/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateDepartment(
    id: number,
    department: IUpdateDepartment,
): Promise<IDepartment> {
    const response = await axiosInstance.patch(`/api/departments/${id}`, department, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deleteDepartment(id: number): Promise<IDepartment> {
    const response = await axiosInstance.delete(`/api/departments/${id}`, {
        headers: authHeader(),
    });
    return response.data;
}
