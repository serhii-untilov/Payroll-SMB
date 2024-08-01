import { companiesFindOne } from '@/services/api/company.service';
import { Company, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCompany(companyId: number) {
    return useQuery<Company, Error>({
        queryKey: [ResourceType.Company, { companyId }],
        queryFn: async () => await companiesFindOne(companyId),
        enabled: !!companyId,
    });
}
