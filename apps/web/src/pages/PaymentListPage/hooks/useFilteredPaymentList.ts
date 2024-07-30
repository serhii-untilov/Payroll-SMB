import { CalcMethod, Payment } from '@repo/openapi';
import { useMemo } from 'react';
import { PaymentListProps } from '../tabs/PaymentList';

export default function useFilteredPaymentList(
    data: Payment[] | undefined,
    props: PaymentListProps,
) {
    return useMemo(() => {
        return data?.filter(
            (o) =>
                (props.companyPayments && o.paymentType?.calcMethod !== CalcMethod.SifPayment) ||
                (props.sifPayments && o.paymentType?.calcMethod === CalcMethod.SifPayment),
        );
    }, [data, props]);
}
