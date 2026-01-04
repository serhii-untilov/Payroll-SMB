import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { Company, Payment, PayPeriod } from '@repo/openapi';
import { MandatoryPaymentList } from './MandatoryPaymentList';
import { useGetPaymentMandatoryList } from '@/hooks/queries/usePaymentMandatory';

type Props = {
    company: Company;
    payPeriod: PayPeriod;
    payment: Payment;
};
const MandatoryPaymentTab = (props: Props) => {
    const { company, payPeriod, payment } = props;
    const {
        data: paymentList,
        isLoading,
        isError,
        error,
    } = useGetPaymentMandatoryList({
        _paymentId: payment.id,
    });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {paymentList && <MandatoryPaymentList {...{ company, payPeriod, payment, paymentList }} />}
        </>
    );
};

export default MandatoryPaymentTab;
