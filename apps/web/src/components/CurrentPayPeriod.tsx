import { Link } from '@/components/layout/Link';
import usePayPeriodName from '@/hooks/usePayPeriodName';
import { Typography } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';

type CurrentPayPeriodProps = {
    companyId: number;
    payPeriod: PayPeriod;
};

const CurrentPayPeriod = ({ companyId, payPeriod }: CurrentPayPeriodProps) => {
    const { t } = useTranslation();
    const periodName = usePayPeriodName(payPeriod);

    return (
        <Link to={`/company/${companyId}?tab-index=1&return=true`}>
            <Typography sx={{ display: 'inline' }}>{t('Current payment period')}: </Typography>{' '}
            <Typography color={'warning.main'} sx={{ fontWeight: 'medium', display: 'inline' }}>
                {periodName}
            </Typography>
        </Link>
    );
};

export default CurrentPayPeriod;
