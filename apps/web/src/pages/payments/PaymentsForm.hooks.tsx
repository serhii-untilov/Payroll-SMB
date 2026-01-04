import { TabComponent } from '@/components/layout/TabsContainer';
import useLocale from '@/hooks/context/useLocale';
import { PaymentStatus, PayPeriod } from '@repo/openapi';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PaymentList from './tabs/PaymentList';

export default function usePaymentsForm(companyId: string, payPeriod: PayPeriod) {
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

    const tabs = useMemo<TabComponent[]>(
        () => [
            {
                label: t('To Pay'),
                tab: (
                    <PaymentList
                        {...{
                            companyId,
                            payPeriod: payPeriod.dateFrom,
                            status: PaymentStatus.Draft,
                            companyPayments: true,
                            sifPayments: true,
                        }}
                    />
                ),
            },
            {
                label: t('Paid'),
                tab: (
                    <PaymentList
                        {...{
                            companyId,
                            payPeriod: payPeriod.dateFrom,
                            status: PaymentStatus.Paid,
                            companyPayments: true,
                            sifPayments: true,
                        }}
                    />
                ),
            },
            {
                label: t('Company Payments'),
                tab: (
                    <PaymentList
                        {...{
                            companyId,
                            payPeriod: payPeriod.dateFrom,
                            companyPayments: true,
                            sifPayments: false,
                        }}
                    />
                ),
            },
            {
                label: t(`SCI Payments`),
                tab: (
                    <PaymentList
                        {...{
                            companyId,
                            payPeriod: payPeriod.dateFrom,
                            companyPayments: false,
                            sifPayments: true,
                        }}
                    />
                ),
            },
            {
                label: t(`All`),
                tab: (
                    <PaymentList
                        {...{
                            companyId,
                            payPeriod: payPeriod.dateFrom,
                            companyPayments: true,
                            sifPayments: true,
                        }}
                    />
                ),
            },
        ],
        [companyId, payPeriod, t],
    );
    return { tabs };
}
