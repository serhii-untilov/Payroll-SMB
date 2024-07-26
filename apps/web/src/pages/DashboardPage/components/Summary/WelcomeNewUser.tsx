import { Link } from '@/components/layout/Link';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WelcomeNewUser = () => {
    const { t } = useTranslation();
    return (
        <Grid container flexDirection={'column'} justifyContent={'space-between'} spacing={1}>
            <Grid item>
                <Link to="/profile?tab=details&return=true">
                    <Typography variant="h3" color="primary">
                        {t('welcome-new-user1')}
                    </Typography>
                </Link>
            </Grid>
            <Grid item>
                <Typography sx={{ display: 'inline' }}>{t('welcome-new-user2')}</Typography>{' '}
            </Grid>
        </Grid>
    );
};

export default WelcomeNewUser;
