import CurrentPayPeriod from '@/components/CurrentPayPeriod';
import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';

type PayPeriodProps = {
    companyId: number;
};

const PayPeriod = ({ companyId }: PayPeriodProps) => {
    const findPayPeriodParams = { companyId, relations: true, fullFieldList: true };
    const { data, isLoading, isError, error } = useCurrentPayPeriod(findPayPeriodParams);
    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <CurrentPayPeriod companyId={companyId} payPeriod={data} />}
        </>
    );
};

export default PayPeriod;
