import { api } from '@/api';
import { Company, CreateCompanyDto, Resource, UpdateCompanyDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetCompany = (companyId: string) => {
    return useQuery<Company, Error>({
        queryKey: [Resource.Company, { companyId }],
        queryFn: async () => (await api.companiesFindOne(companyId)).data,
        enabled: !!companyId,
    });
};

const useCreateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateCompanyDto): Promise<Company> => (await api.companiesCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod]);
        },
    });
};

type UpdateCompany = {
    id: string;
    dto: UpdateCompanyDto;
};

const useUpdateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateCompany): Promise<Company> => (await api.companiesUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod, Resource.Position]);
        },
    });
};

const useRemoveCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.companiesRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([
                Resource.Company,
                Resource.PayPeriod,
                Resource.Department,
                Resource.Position,
                Resource.Task,
            ]);
        },
    });
};

const useCalculateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => await api.companiesSalaryCalculate(id),
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod, Resource.Position, Resource.Task]);
        },
    });
};

export { useGetCompany, useCreateCompany, useUpdateCompany, useRemoveCompany, useCalculateCompany };
