import { api } from '@/api';
import { Company, CreateCompanyDto, ResourceType, UpdateCompanyDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetCompany = (companyId: number) => {
    return useQuery<Company, Error>({
        queryKey: [ResourceType.Company, { companyId }],
        queryFn: async () => (await api.companiesFindOne(companyId)).data,
        enabled: !!companyId,
    });
};

const useCreateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateCompanyDto): Promise<Company> =>
            (await api.companiesCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.Company, ResourceType.PayPeriod]);
        },
    });
};

type UpdateCompany = {
    id: number;
    dto: UpdateCompanyDto;
};

const useUpdateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
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
};

const useRemoveCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.companiesRemove(id)).data,
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
};

const useCalculateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
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
};

export { useGetCompany, useCreateCompany, useUpdateCompany, useRemoveCompany, useCalculateCompany };
