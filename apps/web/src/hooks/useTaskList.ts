import { tasksFindAll } from '@/services/task.service';
import { snackbarError } from '@/utils/snackbar';
import { Task } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | undefined; payPeriod: Date | undefined };
type Result = { data: Task[]; isLoading: boolean };

export function useTaskList(params: Params): Result {
    const { companyId, payPeriod } = params;

    const { data, isError, isLoading, error } = useQuery<Task[], Error>({
        queryKey: [ResourceType.TASK, params],
        queryFn: async () => {
            return companyId && payPeriod
                ? (await tasksFindAll({ companyId, onPayPeriodDate: payPeriod })) ?? []
                : [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
