import { api } from '@/api';
import {
    CreateDepartmentDto,
    DepartmentEntity as Department,
    Resource,
    UpdateDepartmentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetDepartment = (id: string, options?: Record<string, unknown>) => {
    return useQuery<Department, Error>({
        queryKey: [Resource.Department, { id, ...options }],
        queryFn: async () => (await api.departmentFindOne(id, options ?? {})).data,
        enabled: !!id,
    });
};

const useGetDepartmentList = (params: Record<string, unknown>) => {
    return useQuery<Department[], Error>({
        queryKey: [Resource.Department, params],
        queryFn: async () => {
            return (await api.departmentFindAll(params)).data.items.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            ) as unknown as Department[];
        },
        enabled: !!params.companyId,
    });
};

const useCreateDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateDepartmentDto): Promise<Department> => (await api.departmentCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department, Resource.Task]);
        },
    });
};

type UpdateDepartment = {
    id: string;
    version: number;
    dto: UpdateDepartmentDto;
};

const useUpdateDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdateDepartment): Promise<Department> =>
            (await api.departmentUpdate(id, version, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department]);
        },
    });
};

type RemoveDepartment = {
    id: string;
    version: number;
};

const useRemoveDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemoveDepartment) => (await api.departmentRemove(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department, Resource.Task]);
        },
    });
};

export { useGetDepartment, useGetDepartmentList, useCreateDepartment, useUpdateDepartment, useRemoveDepartment };
