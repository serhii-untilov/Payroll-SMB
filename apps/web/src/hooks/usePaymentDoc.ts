import { Payment, PaymentStatus } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useDocTotalSum(payment: Payment | undefined) {
    return useMemo(
        () => (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0),
        [payment],
    );
}

export function useDocTitle(payment: Payment | undefined) {
    const { t } = useTranslation();
    return useMemo(
        () => (payment?.id ? payment?.paymentType?.name : t('New Payment')),
        [payment, t],
    );
}

export function useDocColor(payment: Payment | undefined) {
    return useMemo(() => {
        const status = payment?.status || PaymentStatus.Draft;
        const docDate = dateUTC(payment?.docDate || new Date());
        const now = dateUTC(new Date());
        return status === PaymentStatus.Draft && docDate.getTime() <= now.getTime()
            ? 'warning'
            : 'primary';
    }, [payment]);
}
