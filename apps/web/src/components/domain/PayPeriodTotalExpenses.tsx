import { Typography } from '@mui/material';
import { Link } from '../layout/Link';
import { useTranslation } from 'react-i18next';
import { sumFormatter } from '@/utils/sumFormatter';
import { PayPeriod } from '@repo/openapi';

type PayPeriodTotalExpensesProps = {
    payPeriod: PayPeriod;
};

const PayPeriodTotalExpenses = ({ payPeriod }: PayPeriodTotalExpensesProps) => {
    const { t } = useTranslation();

    return (
        <Link to={'/payroll?tab=payroll&return=true'}>
            <Typography sx={{ display: 'inline' }}>{t('Total expenses')}: </Typography>
            <Typography
                color={'warning.main'}
                sx={{ textAlign: 'end', fontWeight: 'medium', display: 'inline' }}
            >
                {sumFormatter(Number(payPeriod.accruals) + Number(payPeriod.funds), false)}
            </Typography>
        </Link>
    );
};

export default PayPeriodTotalExpenses;
