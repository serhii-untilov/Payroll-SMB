import { api } from '@/api';
import { Resource, UserRole as UserCompany } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetUserCompanyList = (params: Record<string, unknown>) => {
    return useQuery<UserCompany[], Error>({
        queryKey: [Resource.Company, params],
        queryFn: async () =>
            (await api.userRoleFindAll(params)).data.sort((a: UserCompany, b: UserCompany) =>
                (a.company?.name || '').toUpperCase().localeCompare((b.company?.name || '').toUpperCase()),
            ),
        enabled: !!params.userId,
    });
};

type VersionedUserCompany = {
    id: string;
    version: number;
};

const useRemoveUserCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedUserCompany) => (await api.userRoleRemove(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company]);
        },
    });
};

const useRestoreUserCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: VersionedUserCompany) => (await api.userRoleRestore(id, version)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company]);
        },
    });
};

export { useGetUserCompanyList, useRemoveUserCompany, useRestoreUserCompany };
