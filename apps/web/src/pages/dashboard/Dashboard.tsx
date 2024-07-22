import { Link, Loading, PageLayout } from '@/components';
import { useAppContext, useLocale, useTaskList } from '@/hooks';
import { Box, Grid, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Greeting, Reminder, Summary, Todo, Upcoming } from './details';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, themeMode } = useAppContext();
    const companyId = company?.id;
    const onPayPeriodDate = company?.payPeriod;
    const { data: taskList, isLoading } = useTaskList({ companyId, onPayPeriodDate });

    useEffect(() => {}, [locale, themeMode]);

    if (isLoading) return <Loading />;

    return (
        <>
            <PageLayout>
                <Grid container flexDirection="column" alignItems="space-between" spacing={2}>
                    <Grid item>
                        <Greeting />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant="body2"
                                textAlign={'center'}
                                sx={{ display: 'block' }}
                            >
                                {t('Have any questions?')} {t('Visit the')}{' '}
                                <Link
                                    target="_blank"
                                    to="https://github.com/serhii-untilov/Payroll/discussions"
                                >
                                    {t('Support Center')}
                                </Link>
                                {'.'}
                            </Typography>
                        </Box>
                        <Box
                            component="section"
                            sx={{
                                borderRadius: '5px',
                                my: { xs: 1, sm: 2 },
                                mx: { xs: 1, sm: 2, md: 8, lg: 10, xl: 18 },
                                py: { xs: 1, sm: 2 },
                                px: { xs: 1, sm: 4 },
                                color: (theme) => theme.palette.common.black,
                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : blue[50]),
                                border: (theme) =>
                                    theme.palette.mode === 'dark' ? '1px solid grey' : '',
                            }}
                        >
                            <Summary></Summary>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            flexDirection="row"
                            justifyContent="space-around"
                            spacing={3}
                        >
                            <Grid item xs={12} md={6}>
                                <Grid container flexDirection="column">
                                    <Grid item>
                                        <Todo taskList={taskList || []} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container flexDirection="column">
                                    <Grid item>
                                        <Reminder taskList={taskList || []} />
                                    </Grid>
                                    <Grid item>
                                        <Upcoming taskList={taskList || []} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PageLayout>
        </>
    );
}
