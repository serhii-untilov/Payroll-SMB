import { TabComponent } from '@/components/layout/TabsContainer';
import useLocale from '@/hooks/context/useLocale';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PayrollTab from './details/PayrollTab';
import { PayrollFormProps } from './PayrollForm';

export default function usePayrollForm(props: PayrollFormProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('Payroll'),
                tab: <PayrollTab company={props.company} payPeriod={props.payPeriod} />,
            },
            { label: t(`Employer Expenses`) },
            { label: t('Summary Report') },
            { label: t('Accounting Entries') },
        ],
        [props, t],
    );

    return { tabs };
}
