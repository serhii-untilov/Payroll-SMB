import { departmentsFindAll, departmentsFindOne } from '@/services/api/department.service';
import {
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    ResourceType,
} from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const queryKey = ResourceType.Department;

export function useDepartment(id: number, options?: FindOneDepartmentDto) {
    return useQuery<Department, Error>({
        queryKey: [queryKey, { id }],
        queryFn: async () => departmentsFindOne(id, options),
        enabled: !!id,
    });
}

export function useDepartments(params: FindAllDepartmentDto) {
    return useQuery<Department[], Error>({
        queryKey: [queryKey, params],
        queryFn: async () => {
            return (await departmentsFindAll(params)).sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
}
