import { sumFormatter } from '@/utils/sumFormatter';
import { Typography } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import { Link } from './layout/Link';

type PayPeriodTotalExpensesProps = {
    payPeriod: PayPeriod;
};

export default function PayPeriodTotalExpenses({ payPeriod }: PayPeriodTotalExpensesProps) {
    const { t } = useTranslation();
    return (
        <Link to={'/payroll?tab-index=0&return=true'}>
            <Typography sx={{ display: 'inline' }}>{t('Total expenses')}: </Typography>
            <Typography
                color={'warning.main'}
                sx={{ textAlign: 'end', fontWeight: 'medium', display: 'inline' }}
            >
                {sumFormatter(Number(payPeriod.accruals) + Number(payPeriod.funds), false)}
            </Typography>
        </Link>
    );
}
