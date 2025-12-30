import { api } from '@/api';
import { FindAllUserCompanyDto, Resource, UserCompany } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetUserCompanyList = (params: FindAllUserCompanyDto) => {
    return useQuery<UserCompany[], Error>({
        queryKey: [Resource.Company, params],
        queryFn: async () =>
            (await api.userCompaniesFindAll(params)).data.sort((a, b) =>
                (a.company?.name || '')
                    .toUpperCase()
                    .localeCompare((b.company?.name || '').toUpperCase()),
            ),
        enabled: !!params.userId,
    });
};

const useRemoveUserCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.userCompaniesRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company]);
        },
    });
};

const useRestoreUserCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.userCompaniesRestore(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company]);
        },
    });
};

export { useGetUserCompanyList, useRemoveUserCompany, useRestoreUserCompany };
