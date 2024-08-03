import { api } from '@/api';
import { Company, CreateCompanyDto, ResourceType, UpdateCompanyDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

export function useGetCompany(companyId: number) {
    return useQuery<Company, Error>({
        queryKey: [ResourceType.Company, { companyId }],
        queryFn: async () => (await api.companiesFindOne(companyId)).data,
        enabled: !!companyId,
    });
}

export function useCreateCompany() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateCompanyDto): Promise<Company> =>
            (await api.companiesCreate(dto)).data,
        onSuccess: () => {
            // without return invalidateQueries() - 🚀 fire and forget - will not wait
            invalidateQueries([ResourceType.Company, ResourceType.PayPeriod]);
        },
    });
}

// Mutations only take one argument for variables
// https://tkdodo.eu/blog/mastering-mutations-in-react-query#mutations-only-take-one-argument-for-variables
type UpdateCompany = {
    id: number;
    dto: UpdateCompanyDto;
};

export function useUpdateCompany() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateCompany): Promise<Company> =>
            (await api.companiesUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Company,
                ResourceType.PayPeriod,
                ResourceType.Position,
            ]);
        },
    });
}

export function useRemoveCompany() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => await api.companiesRemove(id),
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Company,
                ResourceType.PayPeriod,
                ResourceType.Department,
                ResourceType.Position,
                ResourceType.Task,
            ]);
        },
    });
}

export function useCalculateCompany() {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => await api.companiesSalaryCalculate(id),
        onSuccess: () => {
            invalidateQueries([
                ResourceType.Company,
                ResourceType.PayPeriod,
                ResourceType.Position,
                ResourceType.Task,
            ]);
        },
    });
}
