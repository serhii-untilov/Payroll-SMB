import PayrollCalcDate from '@/components/domain/PayrollCalcDate';
import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import { useCurrentPayPeriod } from '@/hooks/useCurrentPayPeriod';

type PayPeriodProps = {
    companyId: number;
};

const CalcDate = ({ companyId }: PayPeriodProps) => {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isLoading, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <PayrollCalcDate payPeriod={data} />}
        </>
    );
};

export default CalcDate;
