import { Company } from '@repo/openapi';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AccountsTab from './tabs/accounts/AccountsTab';
import DepartmentsTab from './tabs/departments/DepartmentsTab';
import CompanyDetailsTab from './tabs/company/CompanyDetails';
import ManagersTab from './tabs/managers/ManagersTab';
import PayPeriodsTab from './tabs/pay-periods/PayPeriodsTab';
import useLocale from '@/hooks/context/useLocale';

interface CompanyFormParams {
    company?: Company;
    setCompanyId?: (companyId: number) => void;
}

export default function useCompanyForm(params: CompanyFormParams) {
    const { company } = params;
    const { t } = useTranslation();
    const { locale } = useLocale();
    const pageTitle = useMemo(
        () => (company?.id ? company?.name ?? 'Noname' : t('New Company')),
        [company?.id, company?.name, t],
    );
    const tabs = useTabs(params);
    useEffect(() => {}, [locale]);
    return { pageTitle, tabs };
}

function useTabs(params: CompanyFormParams) {
    const { company } = params;
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                label: t('Accounting Details'),
                tab: <CompanyDetailsTab {...params} />,
            },
            {
                label: t('Pay Periods'),
                disabled: !company,
                tab: company && <PayPeriodsTab company={company} />,
            },
            {
                label: t('Departments'),
                disabled: !company,
                tab: company && <DepartmentsTab company={company} />,
            },
            {
                label: t('Company Managers'),
                disabled: !company,
                tab: company && <ManagersTab company={company} />,
            },
            {
                label: t('Accounts'),
                disabled: !company,
                tab: company && <AccountsTab company={company} />,
            },
        ],
        [t, params, company],
    );
}
