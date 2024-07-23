import { departmentsFindOne } from '@/services/department.service';
import { snackbarError } from '@/utils/snackbar';
import { Department, FindOneDepartmentDto, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Result = { department: Department | null; isLoading: boolean };

export function useDepartment(id: number, params?: FindOneDepartmentDto): Result {
    const { data, isError, error, isLoading } = useQuery<Department | null, Error>({
        queryKey: [ResourceType.Department, { id }],
        queryFn: async () => {
            return id ? (await departmentsFindOne(id, params)) ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { department: data ?? null, isLoading };
}
