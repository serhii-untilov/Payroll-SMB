import { api } from '@/api';
import {
    CreateDepartmentDto,
    Department,
    FindAllDepartmentDto,
    FindOneDepartmentDto,
    Resource,
    UpdateDepartmentDto,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetDepartment = (id: string, options?: FindOneDepartmentDto) => {
    return useQuery<Department, Error>({
        queryKey: [Resource.Department, { id, ...options }],
        queryFn: async () => (await api.departmentsFindOne(id, options ?? {})).data,
        enabled: !!id,
    });
};

const useGetDepartmentList = (params: FindAllDepartmentDto) => {
    return useQuery<Department[], Error>({
        queryKey: [Resource.Department, params],
        queryFn: async () => {
            return (await api.departmentsFindAll(params)).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
        enabled: !!params.companyId,
    });
};

const useCreateDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateDepartmentDto): Promise<Department> => (await api.departmentsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department, Resource.Task]);
        },
    });
};

type UpdateDepartment = {
    id: string;
    dto: UpdateDepartmentDto;
};

const useUpdateDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateDepartment): Promise<Department> =>
            (await api.departmentsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department]);
        },
    });
};

const useRemoveDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.departmentsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Department, Resource.Task]);
        },
    });
};

export { useGetDepartment, useGetDepartmentList, useCreateDepartment, useUpdateDepartment, useRemoveDepartment };
