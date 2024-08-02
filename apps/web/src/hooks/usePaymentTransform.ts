import { Payment } from '@repo/openapi';
import { useMemo } from 'react';

export default function usePaymentTransform(payment: Payment | undefined) {
    return useMemo(() => {
        if (!payment) return undefined;
        return {
            ...payment,
            // Calculate sum of all mandatory payments: deductions + funds
            mandatoryPayments: (payment?.deductions || 0) + (payment?.funds || 0),
            total: (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0),
        };
    }, [payment]);
}
