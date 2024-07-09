import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Department } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | null | undefined; relations: true };
type Result = { data: Department[]; isLoading: boolean };

export function useDepartmentList(params: Params): Result {
    const { companyId, relations } = params;
    const { data, isError, isLoading, error } = useQuery<Department[], Error>({
        queryKey: [ResourceType.DEPARTMENT, 'list', params],
        queryFn: async () => {
            return companyId ? (await api.departmentsFindAll(companyId, relations)).data : [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
