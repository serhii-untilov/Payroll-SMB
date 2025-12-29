import { TabComponent } from '@/components/layout/TabsContainer';
import useLocale from '@/hooks/context/useLocale';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, PayPeriod } from '@repo/openapi';

export type TimesheetFormProps = {
    company: Company;
    payPeriod: PayPeriod;
    tabIndex: string | null;
    goBack: boolean;
};

export const useTimesheetForm = (_props: TimesheetFormProps) => {
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => { }, [locale]);

    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('Timesheet Calendar'),
                tab: null,
            },
            {
                label: t('Timesheet'),
                tab: null,
            },
            { label: t('Absence & Downtime'), tab: null, disabled: false },
            {
                label: t('Summary'),
                tab: null,
            },
        ],
        [t],
    );

    return { tabs };
};
