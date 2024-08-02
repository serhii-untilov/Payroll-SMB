import { Payment } from '@repo/openapi';
import { useMemo } from 'react';

export default function useTransformPayment(payment: Payment | undefined) {
    return useMemo(() => {
        if (!payment) return undefined;
        return {
            ...payment,
            mandatoryPayments: (payment?.deductions || 0) + (payment?.funds || 0),
            total: (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0),
        };
    }, [payment]);
}
