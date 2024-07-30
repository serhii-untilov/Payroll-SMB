import { workNormsFindAll } from '@/services/api/workNorm.service';
import { ResourceType, WorkNorm } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export default function useWorkNorm() {
    return useQuery<WorkNorm[], Error>({
        queryKey: [ResourceType.WorkNorm],
        queryFn: async () => await workNormsFindAll(),
    });
}
