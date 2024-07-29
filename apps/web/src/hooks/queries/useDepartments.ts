import { departmentsFindAll, departmentsFindOne } from '@/services/api/department.service';
import {
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    ResourceType,
} from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useDepartment(id: number, options?: FindOneDepartmentDto) {
    return useQuery<Department, Error>({
        queryKey: [ResourceType.Department, { id }],
        queryFn: async () => departmentsFindOne(id, options),
    });
}

export function useDepartments(params: FindAllDepartmentDto) {
    return useQuery<Department[], Error>({
        queryKey: [ResourceType.Department, params],
        queryFn: async () => {
            return (await departmentsFindAll(params)).sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
}
