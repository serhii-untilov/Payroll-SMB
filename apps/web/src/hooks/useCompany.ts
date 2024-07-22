import { companiesFindOne } from '@/services/company.service';
import { snackbarError } from '@/utils/snackbar';
import { Company, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCompany(companyId: number | undefined) {
    const { data, isError, isLoading, error } = useQuery<Company | null, Error>({
        queryKey: [ResourceType.Company, { companyId }],
        queryFn: async () => {
            return companyId ? await companiesFindOne(companyId) : null;
        },
        enabled: !!companyId,
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
