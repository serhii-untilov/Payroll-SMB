import { companiesFindOne } from '@/services/api/company.service';
import { Company, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function queryKey(params?: unknown) {
    return [ResourceType.Company, params];
}

export function useCompany(companyId: number) {
    return useQuery<Company, Error>({
        queryKey: queryKey(companyId),
        queryFn: async () => await companiesFindOne(companyId),
        enabled: !!companyId,
    });
}
