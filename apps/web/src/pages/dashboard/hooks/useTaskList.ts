import { tasksFindAll } from '@/services/api/task.service';
import { FindAllTaskDto, ResourceType, Task } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

type Params = FindAllTaskDto;

export default function useTaskList(params: Params) {
    return useQuery<Task[], Error>({
        queryKey: [ResourceType.Task, params],
        queryFn: async () => await tasksFindAll(params),
    });
}
