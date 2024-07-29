import { TabComponent } from '@/components/layout/TabsContainer';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PositionList } from '../tabs/PositionList';

export default function usePeopleFormTabs(companyId: number, payPeriod: Date) {
    const { t } = useTranslation();
    return useMemo<TabComponent[]>(
        () => [
            {
                label: t('Positions'),
                tab: (
                    <PositionList
                        companyId={companyId}
                        relations={true}
                        onPayPeriodDate={payPeriod}
                    />
                ),
            },
            {
                label: t('Employees'),
                tab: (
                    <PositionList
                        companyId={companyId}
                        employeesOnly={true}
                        relations={true}
                        onPayPeriodDate={payPeriod}
                    />
                ),
            },
            { label: t('Contractors'), tab: null, disabled: true },
            {
                label: t('Vacancies'),
                tab: (
                    <PositionList
                        companyId={companyId}
                        vacanciesOnly={true}
                        relations={true}
                        onPayPeriodDate={payPeriod}
                    />
                ),
            },
            { label: t('Offers'), tab: null, disabled: true },
            {
                label: t('Dismissed'),
                tab: (
                    <PositionList
                        companyId={companyId}
                        employeesOnly={true}
                        dismissedOnly={true}
                        relations={true}
                        onPayPeriodDate={payPeriod}
                    />
                ),
            },
            {
                label: t('All'),
                tab: <PositionList companyId={companyId} includeDeleted={true} relations={true} />,
            },
        ],
        [companyId, payPeriod, t],
    );
}
