import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyDetails from '../tabs/CompanyDetails';
import { CompanyPayPeriods } from '../tabs/CompanyPayPeriods';
import { CompanyDepartments } from '../tabs/CompanyDepartments';
import { CompanyManagers } from '../tabs/CompanyManagers';
import { CompanyAccounts } from '../tabs/CompanyAccounts';
import { Company } from '@repo/openapi';

interface Props {
    company?: Company;
    setCompanyId?: (companyId: number) => void;
}

export default function useCompanyTabs(props: Props) {
    const { company } = props;
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                label: t('Accounting Details'),
                tab: <CompanyDetails {...props} />,
            },
            {
                label: t('Pay Periods'),
                disabled: !company,
                tab: <CompanyPayPeriods company={company} />,
            },
            {
                label: t('Departments'),
                disabled: !company,
                tab: <CompanyDepartments company={company} />,
            },
            {
                label: t('Company Managers'),
                disabled: !company,
                tab: <CompanyManagers company={company} />,
            },
            {
                label: t('Accounts'),
                disabled: !company,
                tab: <CompanyAccounts company={company} />,
            },
        ],
        [],
    );
}
