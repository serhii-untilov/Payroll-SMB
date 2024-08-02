import { TabComponent } from '@/components/layout/TabsContainer';
import { PaymentStatus } from '@repo/openapi';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PaymentList from './tabs/PaymentList';
import useLocale from '@/hooks/context/useLocale';

export default function usePaymentsForm(companyId: number, payPeriod: Date) {
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('To Pay'),
                tab: (
                    <PaymentList
                        {...{ companyId, payPeriod }}
                        status={PaymentStatus.Draft}
                        companyPayments={true}
                        sifPayments={true}
                    />
                ),
            },
            {
                label: t('Paid'),
                tab: (
                    <PaymentList
                        {...{ companyId, payPeriod }}
                        status={PaymentStatus.Paid}
                        companyPayments={true}
                        sifPayments={true}
                    />
                ),
            },
            {
                label: t('Company Payments'),
                tab: (
                    <PaymentList
                        {...{ companyId, payPeriod }}
                        companyPayments={true}
                        sifPayments={false}
                    />
                ),
            },
            {
                label: t(`SCI Payments`),
                tab: (
                    <PaymentList
                        {...{ companyId, payPeriod }}
                        companyPayments={false}
                        sifPayments={true}
                    />
                ),
            },
            {
                label: t(`All`),
                tab: (
                    <PaymentList
                        {...{ companyId, payPeriod }}
                        companyPayments={true}
                        sifPayments={true}
                    />
                ),
            },
        ],
        [companyId, payPeriod, t],
    );
    return { tabs };
}
