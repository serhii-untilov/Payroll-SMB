import { Link } from '@/components/layout/Link';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import usePayrollCalcDate from '../hooks/usePayrollCalcDate';

const PayrollCalcDate = ({ payPeriod }) => {
    const payrollCalcDate = usePayrollCalcDate(payPeriod.updatedDate);
    const { t } = useTranslation();

    return (
        <Link to={'/payroll?tab-index=0&return=true'}>
            <Typography sx={{ textAlign: 'end', display: 'inline' }}>{t('Calculation was completed')}: </Typography>{' '}
            <Typography
                sx={{
                    display: 'inline',
                    fontWeight: 'medium',
                }}
            >
                {payrollCalcDate}
            </Typography>
        </Link>
    );
};

export default PayrollCalcDate;
