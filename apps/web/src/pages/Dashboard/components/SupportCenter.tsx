import { Link } from '@/components/layout/Link';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSupportCenter from '../hooks/useSupportCenter';

const SupportCenter = () => {
    const { t } = useTranslation();
    const linkToSupportCenter = useSupportCenter();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
            }}
        >
            <Typography variant="body2" textAlign={'center'} sx={{ display: 'block' }}>
                {t('Have any questions?')} {t('Visit the')}{' '}
                <Link target="_blank" to={linkToSupportCenter}>
                    {t('Support Center')}
                </Link>
                {'.'}
            </Typography>
        </Box>
    );
};

export default SupportCenter;
