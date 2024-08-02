import { userCompaniesFindAll } from '@/services/api/user-companies.service';
import { usersFindCurrent } from '@/services/auth/auth.service';
import { FindAllUserCompanyDto, ResourceType, User, UserCompany } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
    return useQuery<User, Error>({
        queryKey: [ResourceType.User, 'current', { relations: true }],
        queryFn: async () => await usersFindCurrent({ relations: true }),
    });
}

export default function useUserCompanies(params: FindAllUserCompanyDto) {
    return useQuery<UserCompany[], Error>({
        queryKey: [ResourceType.Company, params],
        queryFn: async () => await userCompaniesFindAll(params),
        enabled: !!params.userId,
    });
}
