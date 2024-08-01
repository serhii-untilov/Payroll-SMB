import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import { Company } from '@repo/openapi';
import useCompanyForm from './hooks/CompanyForm.hooks';

interface CompanyFormProps {
    company?: Company;
    tabIndex?: string | null;
    goBack?: boolean;
    setCompanyId?: (companyId: number) => void;
}

export default function CompanyForm(props: CompanyFormProps) {
    const { tabIndex, goBack } = props;
    const { pageTitle, tabs } = useCompanyForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <TabsContainer id="company-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
}
