import { api } from '@/api';
import { FindAllUserCompanyDto, ResourceType, UserCompany } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetUserCompanyList = (params: FindAllUserCompanyDto) => {
    return useQuery<UserCompany[], Error>({
        queryKey: [ResourceType.Company, params],
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
        mutationFn: async (id: number) => (await api.userCompaniesRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Company]);
        },
    });
};

const useRestoreUserCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.userCompaniesRestore(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Company]);
        },
    });
};

export { useGetUserCompanyList, useRemoveUserCompany, useRestoreUserCompany };
