import { userCompaniesFindAll } from '@/services/user-companies.service';
import { UserCompany, ResourceType, FindAllUserCompanyDto } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export default function useUserCompanies(params: FindAllUserCompanyDto) {
    return useQuery<UserCompany[], Error>({
        queryKey: [ResourceType.Company, params],
        queryFn: async () => await userCompaniesFindAll(params),
        enabled: !!params.userId,
    });
}
