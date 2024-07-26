import { Link } from '@/components/layout/Link';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSupportCenter from '../hooks/useSupportCenter';

const SupportCenter = () => {
    const { t } = useTranslation();
    const linkToSupportCenter = useSupportCenter();

    return (
        <Typography variant="body2" textAlign={'center'} sx={{ display: 'block' }}>
            {t('Have any questions?')} {t('Visit the')}{' '}
            <Link target="_blank" to={linkToSupportCenter}>
                {t('Support Center')}
            </Link>
            {'.'}
        </Typography>
    );
};

export default SupportCenter;
