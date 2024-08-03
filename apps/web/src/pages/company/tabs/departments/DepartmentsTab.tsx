import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetDepartmentList } from '@/hooks/queries/useDepartment';
import { Company } from '@repo/openapi';
import DepartmentList from './DepartmentList';

type DepartmentsTabProps = {
    company: Company;
};

export default function DepartmentsTab({ company }: DepartmentsTabProps) {
    const { data, isLoading, isError, error } = useGetDepartmentList({
        companyId: company.id,
        relations: true,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <DepartmentList company={company} departments={data} />}
        </>
    );
}
