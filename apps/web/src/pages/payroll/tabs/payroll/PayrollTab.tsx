import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePositionBalances } from '@/hooks/queries/usePositions';
import { Company, PayPeriod } from '@repo/openapi';
import PayrollList from './PayrollList';

type PayrollTabProps = {
    company: Company;
    payPeriod: PayPeriod;
};

const PayrollTab = (props: PayrollTabProps) => {
    const { data, isError, isLoading, error } = usePositionBalances({
        companyId: props.company.id,
        payPeriod: props.payPeriod.dateFrom,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <PayrollList company={props.company} payPeriod={props.payPeriod} balances={data} />
            )}
        </>
    );
};

export default PayrollTab;
