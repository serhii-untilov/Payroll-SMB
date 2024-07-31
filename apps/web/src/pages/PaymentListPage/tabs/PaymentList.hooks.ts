import { CalcMethod, Payment } from '@repo/openapi';
import { useMemo } from 'react';
import { PaymentListProps } from './PaymentList';

export default function usePaymentList(data: Payment[] | undefined, props: PaymentListProps) {
    const payments = useMemo(() => {
        return data?.filter(
            (o) =>
                (props.companyPayments && o.paymentType?.calcMethod !== CalcMethod.SifPayment) ||
                (props.sifPayments && o.paymentType?.calcMethod === CalcMethod.SifPayment),
        );
    }, [data, props]);

    return { payments };
}
