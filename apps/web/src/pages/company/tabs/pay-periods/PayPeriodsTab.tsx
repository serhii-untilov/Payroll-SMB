import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetCurrentPayPeriod, useGetPayPeriodList } from '@/hooks/queries/usePayPeriod';
import { Company } from '@repo/openapi';
import { PayPeriodList } from './PayPeriodList';

type PayPeriodsTabProps = {
    company: Company;
};

export default function PayPeriodsTab({ company }: PayPeriodsTabProps) {
    const payPeriods = useGetPayPeriodList({
        companyId: company.id,
        relations: true,
        fullFieldList: true,
    });
    const currentPayPeriod = useGetCurrentPayPeriod({
        companyId: company.id,
        relations: false,
        fullFieldList: true,
    });

    return (
        <>
            {(payPeriods.isLoading || currentPayPeriod.isLoading) && <LoadingDisplay />}
            {payPeriods.isError && <ErrorDisplay error={payPeriods.error} />}
            {currentPayPeriod.isError && <ErrorDisplay error={currentPayPeriod.error} />}
            {payPeriods.data && (
                <PayPeriodList
                    company={company}
                    payPeriods={payPeriods.data}
                    currentPayPeriod={currentPayPeriod.data}
                />
            )}
        </>
    );
}
