import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePayments } from '@/hooks/queries/usePayments';
import { FindAllPaymentDto } from '@repo/openapi';
import useFilteredPaymentList from '../hooks/useFilteredPaymentList';
import { PaymentListTab } from './PaymentListTab';

export type PaymentListProps = FindAllPaymentDto & {
    companyPayments: boolean;
    sifPayments: boolean;
};

export default function PaymentList(props: PaymentListProps) {
    const { companyId, payPeriod, status } = props;
    const params = { relations: true, companyId, payPeriod, ...(status ? { status } : {}) };
    const { data: rawData, isLoading, isError, error } = usePayments(params);
    const data = useFilteredPaymentList(rawData, props);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PaymentListTab payments={data} />}
        </>
    );
}
