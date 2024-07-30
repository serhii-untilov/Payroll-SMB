import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useDepartments } from '@/hooks/queries/useDepartments';
import { Company } from '@repo/openapi';
import DepartmentList from './DepartmentList';

type DepartmentsTabProps = {
    company: Company;
};

export default function DepartmentsTab({ company }: DepartmentsTabProps) {
    const { data, isLoading, isError, error } = useDepartments({
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
