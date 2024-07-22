import { tasksFindAll } from '@/services/task.service';
import { snackbarError } from '@/utils/snackbar';
import { Task } from '@repo/openapi';
import { ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | undefined; onPayPeriodDate: Date | undefined };
type Result = { data: Task[]; isLoading: boolean };

export function useTaskList(params: Params): Result {
    const { companyId, onPayPeriodDate } = params;

    const { data, isError, isLoading, error } = useQuery<Task[], Error>({
        queryKey: [ResourceType.Task, params],
        queryFn: async () => {
            return companyId && onPayPeriodDate
                ? (await tasksFindAll({ ...params, companyId, onPayPeriodDate })) ?? []
                : [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
