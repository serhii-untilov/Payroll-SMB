import PayrollCalcDate from '@/components/PayrollCalcDate';
import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';

type PayPeriodProps = {
    companyId: number;
};

export default function CalcDate({ companyId }: PayPeriodProps) {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && <PayrollCalcDate payPeriod={data} />}
        </>
    );
}
