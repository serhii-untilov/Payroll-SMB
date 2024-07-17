import { departmentsFindAll } from '@/services/department.service';
import { snackbarError } from '@/utils/snackbar';
import { Department, FindAllDepartmentDto } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Result = { data: Department[]; isLoading: boolean };

export function useDepartmentList(params: Partial<FindAllDepartmentDto>): Result {
    const { companyId, relations } = params;
    const { data, isError, isLoading, error } = useQuery<Department[], Error>({
        queryKey: [ResourceType.DEPARTMENT, params],
        queryFn: async () => {
            const response = companyId
                ? (await departmentsFindAll({ companyId, relations })) ?? []
                : [];
            return response.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
