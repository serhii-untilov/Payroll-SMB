import { Company } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AccountsTab from './tabs/AccountsTab';
import DepartmentsTab from './tabs/DepartmentsTab';
import CompanyDetailsTab from './tabs/CompanyDetailsTab/CompanyDetails';
import ManagersTab from './tabs/ManagersTab';
import PayPeriodsTab from './tabs/PayPeriodsTab';

interface CompanyFormParams {
    company?: Company;
    setCompanyId?: (companyId: number) => void;
}

export default function useCompanyForm(params: CompanyFormParams) {
    const { company } = params;
    const { t } = useTranslation();

    const pageTitle = useMemo(() => {
        return params.company?.id ? params.company?.name ?? 'Noname' : t('New Company');
    }, [params, t]);

    const tabs = useMemo(
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
    return { pageTitle, tabs };
}
