import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import useLocale from '@/hooks/context/useLocale';
import { Company } from '@repo/openapi';
import { useEffect } from 'react';
import useCompanyForm from './CompanyForm.hooks';

interface CompanyFormProps {
    company?: Company;
    tabIndex?: string | null;
    goBack?: boolean;
    setCompanyId?: (companyId: number) => void;
}

export default function CompanyForm(props: CompanyFormProps) {
    const { tabIndex, goBack } = props;
    const { locale } = useLocale();
    const { pageTitle, tabs } = useCompanyForm(props);

    useEffect(() => {}, [locale]);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <TabsContainer id="company-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
}
