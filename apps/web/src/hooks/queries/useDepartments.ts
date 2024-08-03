import { api } from '@/api';
import {
    CreateDepartmentDto,
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    ResourceType,
    UpdateDepartmentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

export function useGetDepartment(id: number, options?: FindOneDepartmentDto) {
    return useQuery<Department, Error>({
        queryKey: [ResourceType.Department, { id, ...options }],
        queryFn: async () => (await api.departmentsFindOne(id, options ?? {})).data,
        enabled: !!id,
    });
}

export function useGetDepartments(params: FindAllDepartmentDto) {
    return useQuery<Department[], Error>({
        queryKey: [ResourceType.Department, params],
        queryFn: async () => {
            return (await api.departmentsFindAll(params)).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
        enabled: !!params.companyId,
    });
}

export function useCreateDepartment() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateDepartmentDto): Promise<Department> =>
            (await api.departmentsCreate(dto)).data,
        onSuccess: () => {
            // without return invalidateQueries() - 🚀 fire and forget - will not wait
            invalidateQueries([ResourceType.Department, ResourceType.Task]);
        },
    });
}

// Mutations only take one argument for variables
// https://tkdodo.eu/blog/mastering-mutations-in-react-query#mutations-only-take-one-argument-for-variables
type UpdateDepartment = {
    id: number;
    dto: UpdateDepartmentDto;
};

export function useUpdateDepartment() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateDepartment): Promise<Department> =>
            (await api.departmentsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Department]);
        },
    });
}

export function useRemoveDepartment() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => await api.departmentsRemove(id),
        onSuccess: () => {
            invalidateQueries([ResourceType.Department, ResourceType.Task]);
        },
    });
}
