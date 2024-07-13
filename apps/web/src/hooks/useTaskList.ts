import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Task } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

type Params = { companyId: number | undefined; payPeriod: string | undefined };
type Result = { data: Task[]; isLoading: boolean };

export function useTaskList(params: Params): Result {
    const { companyId, payPeriod } = params;

    const { data, isError, isLoading, error } = useQuery<Task[], Error>({
        queryKey: [ResourceType.TASK, 'list', params],
        queryFn: async () => {
            return companyId && payPeriod
                ? (await api.tasksFindAll({ companyId, onPayPeriodDate: payPeriod })).data
                : [];
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data: data ?? [], isLoading };
}
