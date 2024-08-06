import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPaymentList } from '@/hooks/queries/usePayment';
import { FindAllPaymentDto } from '@repo/openapi';
import { useState } from 'react';
import usePaymentList from './PaymentList.hooks';
import { PaymentListTab } from './PaymentListTab';

export type PaymentListProps = FindAllPaymentDto & {
    companyPayments: boolean;
    sifPayments: boolean;
};

export default function PaymentList(props: PaymentListProps) {
    const { companyId, payPeriod, status } = props;
    const [showDeleted, setShowDeleted] = useState(false);
    const { data, isLoading, isError, error } = useGetPaymentList({
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
