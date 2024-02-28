import { Box, Grid, Typography } from '@mui/material';
import { amber } from '@mui/material/colors';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Greeting } from '../components/layout/Greeting';
import { Link } from '../components/layout/Link';
import PageLayout from '../components/layout/PageLayout';
import { SummaryTodo } from '../components/layout/SummaryTodo';
import useLocale from '../hooks/useLocale';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout title={t('Dashboard')}>
                <Grid container flexDirection="column" spacing={2} sx={{ height: '100%' }}>
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
                    <Grid item>
                        <Box
                            component="section"
                            sx={{
                                border: '1px dashed lightgrey',
                                borderRadius: '5px',
                                my: { xs: 1, sm: 2 },
                                mx: { xs: 1, sm: 2, md: 8, lg: 18 },
                                p: { xs: 1, sm: 3 },
                                bgcolor: amber[50],
                            }}
                        >
                            <SummaryTodo></SummaryTodo>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        container
                        flexDirection="row"
                        justifyContent="space-around"
                        spacing={1}
                    >
                        <Grid item>
                            <Typography component="h3" variant="h3" textAlign={'center'}>
                                {t('Things to do')}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                flexDirection="column"
                                justifyContent="space-between"
                                spacing={1}
                            >
                                <Grid item>
                                    <Typography component="h3" variant="h3" textAlign={'center'}>
                                        {t('Reminders')}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography component="h3" variant="h3" textAlign={'center'}>
                                        {t('Upcoming')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PageLayout>
        </>
    );
}
