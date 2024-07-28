import { lawsFindAll } from '@/services/law.service';
import { Law, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useLaws() {
    return useQuery<Law[], Error>({
        queryKey: [ResourceType.Law],
        queryFn: async () => await lawsFindAll(),
    });
}
