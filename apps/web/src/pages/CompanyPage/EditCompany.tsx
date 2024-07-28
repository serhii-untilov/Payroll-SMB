import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
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
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {company && <CompanyForm company={company} tabIndex={tabIndex} goBack={goBack} />}
        </>
    );
}
