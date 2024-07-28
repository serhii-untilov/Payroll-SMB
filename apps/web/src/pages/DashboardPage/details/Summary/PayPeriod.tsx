import CurrentPayPeriod from '@/components/CurrentPayPeriod';
import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';

type PayPeriodProps = {
    companyId: number;
};

export default function PayPeriod({ companyId }: PayPeriodProps) {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isLoading, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <CurrentPayPeriod companyId={companyId} payPeriod={data} />}
        </>
    );
}
