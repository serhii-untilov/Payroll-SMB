import { Link } from '@/components/layout/Link';
import useSupportCenter from '@/hooks/queries/useSupportCenter';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SupportCenter() {
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
}
