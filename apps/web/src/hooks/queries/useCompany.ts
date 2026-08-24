import { api } from '@/api';
import { CompanyEntity as Company, CreateCompanyDto, Resource, UpdateCompanyDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetCompany = (companyId: string) => {
    return useQuery<Company, Error>({
        queryKey: [Resource.Company, { companyId }],
        queryFn: async () => (await api.companyFindOne(companyId)).data,
        enabled: !!companyId,
    });
};

const useCreateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateCompanyDto): Promise<Company> => (await api.companyCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod]);
        },
    });
};

type UpdateCompany = {
    id: string;
    version: number;
    dto: UpdateCompanyDto;
};

const useUpdateCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdateCompany): Promise<Company> =>
            (await api.companyUpdate(id, version, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod, Resource.Position]);
        },
    });
};

type RemoveCompany = {
    id: string;
    version: number;
};

const useRemoveCompany = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemoveCompany) => (await api.companyRemove(id, version)).data,
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
        mutationFn: async (id: string) => await api.companySalaryCalculate(id),
        onSuccess: () => {
            invalidateQueries([Resource.Company, Resource.PayPeriod, Resource.Position, Resource.Task]);
        },
    });
};

export { useGetCompany, useCreateCompany, useUpdateCompany, useRemoveCompany, useCalculateCompany };
