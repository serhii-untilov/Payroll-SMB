import { departmentsFindAll, departmentsFindOne } from '@/services/department.service';
import {
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    ResourceType,
} from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useDepartment(id: number, params?: FindOneDepartmentDto) {
    return useQuery<Department | null, Error>({
        queryKey: [ResourceType.Department, { id }],
        queryFn: async () => {
            return id ? (await departmentsFindOne(id, params)) ?? null : null;
        },
    });
}

export function useDepartments(params: Partial<FindAllDepartmentDto>) {
    const { companyId, relations } = params;
    return useQuery<Department[], Error>({
        queryKey: [ResourceType.Department, params],
        queryFn: async () => {
            const response = companyId
                ? (await departmentsFindAll({ companyId, relations })) ?? []
                : [];
            return response.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
}
