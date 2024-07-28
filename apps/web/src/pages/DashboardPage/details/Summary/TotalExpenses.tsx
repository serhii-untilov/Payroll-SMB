import PayPeriodTotalExpenses from '@/components/PayPeriodTotalExpenses';
import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';

type TotalExpensesProps = {
    companyId: number;
};

export default function TotalExpenses({ companyId }: TotalExpensesProps) {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isLoading, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PayPeriodTotalExpenses payPeriod={data} />}
        </>
    );
}
