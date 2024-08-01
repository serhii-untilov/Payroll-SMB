import { TabComponent } from '@/components/layout/TabsContainer';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PositionList } from './tabs/PositionList';
import { PeopleFormProps } from './PeopleForm';

export default function usePeopleForm(props: PeopleFormProps) {
    const { t } = useTranslation();
    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('Positions'),
                tab: (
                    <PositionList
                        companyId={props.company.id}
                        relations={true}
                        onPayPeriodDate={props.payPeriod}
                    />
                ),
            },
            {
                label: t('Employees'),
                tab: (
                    <PositionList
                        companyId={props.company.id}
                        employeesOnly={true}
                        relations={true}
                        onPayPeriodDate={props.payPeriod}
                    />
                ),
            },
            { label: t('Contractors'), tab: null, disabled: true },
            {
                label: t('Vacancies'),
                tab: (
                    <PositionList
                        companyId={props.company.id}
                        vacanciesOnly={true}
                        relations={true}
                        onPayPeriodDate={props.payPeriod}
                    />
                ),
            },
            { label: t('Offers'), tab: null, disabled: true },
            {
                label: t('Dismissed'),
                tab: (
                    <PositionList
                        companyId={props.company.id}
                        employeesOnly={true}
                        dismissedOnly={true}
                        relations={true}
                        onPayPeriodDate={props.payPeriod}
                    />
                ),
            },
            {
                label: t('All'),
                tab: (
                    <PositionList
                        companyId={props.company.id}
                        includeDeleted={true}
                        relations={true}
                    />
                ),
            },
        ],
        [props, t],
    );

    return { tabs };
}