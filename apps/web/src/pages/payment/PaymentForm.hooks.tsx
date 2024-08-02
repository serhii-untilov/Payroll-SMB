import useLocale from '@/hooks/context/useLocale';
import { PaymentStatus } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentFormProps } from './PaymentForm';
import EmployeePaymentTab from './tabs/employee-payment/EmployeePaymentTab';
import { MandatoryPayment } from './tabs/mandatory-payment/MandatoryPayment';
import PaymentDetails from './tabs/payment-details/PaymentDetails';

const usePaymentForm = (props: PaymentFormProps) => {
    const { company, payPeriod, payment } = props;
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

    const title = useMemo(
        () => (payment?.id ? payment?.paymentType?.name : t('New Payment')),
        [payment, t],
    );

    const totalSum = useMemo(
        () => (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0),
        [payment],
    );

    const color = useMemo(() => {
        const status = payment?.status || PaymentStatus.Draft;
        const docDate = dateUTC(payment?.docDate || new Date());
        const now = dateUTC(new Date());
        return status === PaymentStatus.Draft && docDate.getTime() <= now.getTime()
            ? 'warning'
            : 'primary';
    }, [payment]);

    const tabs = useMemo(
        () => [
            {
                label: t('Document'),
                tab: <PaymentDetails {...props} />,
            },
            {
                label: t('Employees'),
                disabled: !payment,
                tab: payment && <EmployeePaymentTab {...{ company, payPeriod, payment }} />,
            },
            {
                label: t('Mandatory Payments'),
                disabled: !payment,
                tab: payment && <MandatoryPayment {...{ company, payPeriod, payment }} />,
            },
        ],
        [t, props, company, payPeriod, payment],
    );

    return { title, totalSum, color, tabs };
};

export default usePaymentForm;
