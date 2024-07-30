import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EmployeePayments } from '../tabs/EmployeePayments';
import { MandatoryPayments } from '../tabs/MandatoryPayments';
import { PaymentDetails } from '../tabs/PaymentDetails';
import { Company, Payment } from '@repo/openapi';

interface Props {
    company: Company;
    payPeriod: Date;
    payment?: Payment;
    setPaymentId?: (paymentId: number) => void;
}

export default function usePaymentTabs(props: Props) {
    const { company, payPeriod, payment } = props;
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                label: t('Document'),
                tab: <PaymentDetails {...props} />,
            },
            {
                label: t('Employees'),
                disabled: !payment,
                tab: payment && <EmployeePayments {...{ company, payPeriod, payment }} />,
            },
            {
                label: t('Mandatory Payments'),
                disabled: !payment,
                tab: payment && <MandatoryPayments {...{ company, payPeriod, payment }} />,
            },
        ],
        [t, props, company, payPeriod, payment],
    );
}
