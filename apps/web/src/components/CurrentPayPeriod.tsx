import { Link } from '@/components/layout/Link';
import usePayPeriodName from '@/hooks/usePayPeriodName';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function CurrentPayPeriod({ company, payPeriod }) {
    const { t } = useTranslation();
    const periodName = usePayPeriodName(payPeriod);

    return (
        <Link to={`/company/${company.id}?tab-index=1&return=true`}>
            <Typography sx={{ display: 'inline' }}>{t('Current payment period')}: </Typography>{' '}
            <Typography color={'warning.main'} sx={{ fontWeight: 'medium', display: 'inline' }}>
                {periodName}
            </Typography>
        </Link>
    );
}
