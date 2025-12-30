import CompanyForm from './CompanyForm';

interface CreateCompanyProps {
    setCompanyId: (companyId: string) => void;
}

export default function CreateCompany(props: CreateCompanyProps) {
    return <CompanyForm goBack={true} setCompanyId={props.setCompanyId} />;
}
