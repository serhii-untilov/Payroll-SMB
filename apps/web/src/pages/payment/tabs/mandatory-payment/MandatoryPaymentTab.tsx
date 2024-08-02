import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useMandatoryPayments } from '@/hooks/queries/usePayments';
import { Company, Payment } from '@repo/openapi';
import { MandatoryPaymentList } from './MandatoryPaymentList';

type Props = {
    company: Company;
    payPeriod: Date;
    payment: Payment;
};
const MandatoryPaymentTab = (props: Props) => {
    const { company, payPeriod, payment } = props;
    const {
        data: paymentList,
        isLoading,
        isError,
        error,
    } = useMandatoryPayments({
        _paymentId: payment.id,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {paymentList && (
                <MandatoryPaymentList {...{ company, payPeriod, payment, paymentList }} />
            )}
        </>
    );
};

export default MandatoryPaymentTab;
