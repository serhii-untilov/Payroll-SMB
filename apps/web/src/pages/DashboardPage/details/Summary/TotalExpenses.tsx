import PayPeriodTotalExpenses from '@/components/PayPeriodTotalExpenses';
import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';

type TotalExpensesProps = {
    companyId: number;
};

const TotalExpenses = ({ companyId }: TotalExpensesProps) => {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isLoading, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <PayPeriodTotalExpenses payPeriod={data} />}
        </>
    );
};

export default TotalExpenses;
