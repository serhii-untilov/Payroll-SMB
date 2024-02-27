import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Greeting } from '../components/layout/Greeting';
import PageLayout from '../components/layout/PageLayout';
import useLocale from '../hooks/useLocale';
import { Link } from '../components/layout/Link';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout title={t('Dashboard')}>
                <Grid container flexDirection="column" justifyContent="center" spacing={1}>
                    <Grid item>
                        <Typography component="h2" variant="h2" textAlign={'center'}>
                            <Greeting />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" textAlign={'center'}>
                            {t('Have any questions? Visit the')}{' '}
                            <Link
                                target="_blank"
                                to="https://github.com/serhii-untilov/Payroll/discussions"
                            >
                                {t('Support Center')}
                            </Link>
                            {'.'}
                        </Typography>
                    </Grid>
                </Grid>
            </PageLayout>
        </>
    );
}
