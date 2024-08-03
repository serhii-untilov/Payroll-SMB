import { tasksFindAll } from '@/services/task.service';
import { FindAllTaskDto, ResourceType, Task } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useTasks(params: FindAllTaskDto) {
    return useQuery<Task[], Error>({
        queryKey: [ResourceType.Task, params],
        queryFn: async () => await tasksFindAll(params),
    });
}
