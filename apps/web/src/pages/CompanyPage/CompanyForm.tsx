import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import useLocale from '@/hooks/context/useLocale';
import { Company } from '@repo/openapi';
import { useEffect } from 'react';
import useTabs from './hooks/useCompanyTabs';
import usePageTitle from './hooks/usePageTitle';

interface CompanyFormProps {
    company?: Company;
    tabIndex?: string | null;
    goBack?: boolean;
    setCompanyId?: (companyId: number) => void;
}

export default function CompanyForm(props: CompanyFormProps) {
    const { company, tabIndex, goBack } = props;
    const pageTitle = usePageTitle(company);
    const { locale } = useLocale();
    const tabs = useTabs(props);

    useEffect(() => {}, [locale]);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <TabsContainer id="company-tabs" tabIndex={tabIndex} tabs={tabs} />
        </PageLayout>
    );
}
