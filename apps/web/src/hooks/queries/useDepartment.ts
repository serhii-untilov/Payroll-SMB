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

const useGetDepartment = (id: number, options?: FindOneDepartmentDto) => {
    return useQuery<Department, Error>({
        queryKey: [ResourceType.Department, { id, ...options }],
        queryFn: async () => (await api.departmentsFindOne(id, options ?? {})).data,
        enabled: !!id,
    });
};

const useGetDepartmentList = (params: FindAllDepartmentDto) => {
    return useQuery<Department[], Error>({
        queryKey: [ResourceType.Department, params],
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
        mutationFn: async (dto: CreateDepartmentDto): Promise<Department> =>
            (await api.departmentsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Department, ResourceType.Task]);
        },
    });
};

type UpdateDepartment = {
    id: number;
    dto: UpdateDepartmentDto;
};

const useUpdateDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateDepartment): Promise<Department> =>
            (await api.departmentsUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Department]);
        },
    });
};

const useRemoveDepartment = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.departmentsRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Department, ResourceType.Task]);
        },
    });
};

export {
    useGetDepartment,
    useGetDepartmentList,
    useCreateDepartment,
    useUpdateDepartment,
    useRemoveDepartment,
};
