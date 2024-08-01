import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentPayPeriod } from '@/hooks/queries/useCurrentPayPeriod';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { Company } from '@repo/openapi';
import { PayPeriodList } from './PayPeriodList';

type PayPeriodsTabProps = {
    company: Company;
};

export default function PayPeriodsTab({ company }: PayPeriodsTabProps) {
    const payPeriods = usePayPeriods({
        companyId: company.id,
        relations: true,
        fullFieldList: true,
    });
    const currentPayPeriod = useCurrentPayPeriod({
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
