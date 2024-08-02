import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePayments } from '@/hooks/queries/usePayments';
import { FindAllPaymentDto } from '@repo/openapi';
import usePaymentList from './PaymentList.hooks';
import { PaymentListTab } from './PaymentListTab';
import { useState } from 'react';

export type PaymentListProps = FindAllPaymentDto & {
    companyPayments: boolean;
    sifPayments: boolean;
};

export default function PaymentList(props: PaymentListProps) {
    const { companyId, payPeriod, status } = props;
    const [showDeleted, setShowDeleted] = useState(false);
    const { data, isLoading, isError, error } = usePayments({
        relations: true,
        companyId,
        payPeriod,
        ...(status ? { status } : {}),
        withDeleted: showDeleted,
    });
    const { payments } = usePaymentList(data, props);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {payments && <PaymentListTab {...{ payments, showDeleted, setShowDeleted }} />}
        </>
    );
}
