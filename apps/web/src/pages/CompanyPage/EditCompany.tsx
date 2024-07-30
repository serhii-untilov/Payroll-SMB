import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCompany } from '@/hooks/queries/useCompany';
import CompanyForm from './CompanyForm';

interface EditCompanyProps {
    companyId: number;
    tabIndex: string | null;
    goBack: boolean;
}

export default function EditCompany(props: EditCompanyProps) {
    const { companyId, tabIndex, goBack } = props;
    const { data: company, isLoading, isError, error } = useCompany(companyId);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {company && <CompanyForm company={company} tabIndex={tabIndex} goBack={goBack} />}
        </>
    );
}
