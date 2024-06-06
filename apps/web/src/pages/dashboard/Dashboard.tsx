import { Box, Grid, Typography } from '@mui/material';
import { amber, blue } from '@mui/material/colors';
import { ITask } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Greeting } from './details/Greeting';
import { Link } from '../../components/layout/Link';
import PageLayout from '../../components/layout/PageLayout';
import { Summary } from './details/Summary';
import { Loading } from '../../components/utility/Loading';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getTasks } from '../../services/task.service';
import { Reminder } from './details/Reminder';
import { Todo } from './details/Todo';
import { Upcoming } from './details/Upcoming';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();

    useEffect(() => {}, [locale]);

    const {
        data: taskList,
        isError,
        isLoading,
        error,
    } = useQuery<ITask[], Error>({
        queryKey: ['task', 'list', company],
        queryFn: async () => {
            return await getTasks(company?.id ? { companyId: company?.id } : {});
        },
        enabled: !!company?.id,
    });
    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <PageLayout>
                <Grid container flexDirection="column" alignItems="space-between" spacing={2}>
                    <Grid item>
                        <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
                            <Greeting />
                        </Typography>
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
                        <Box
                            component="section"
                            // boxShadow={1}
                            sx={{
                                // border: '1px dashed lightgrey',
                                borderRadius: '5px',
                                my: { xs: 1, sm: 2 },
                                mx: { xs: 1, sm: 2, md: 8, lg: 18 },
                                py: { xs: 1, sm: 2 },
                                px: { xs: 1, sm: 4 },
                                color: (theme) => theme.palette.common.black,
                                bgcolor: blue[50],
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
                            <Grid item xs={6}>
                                <Typography component="h3" variant="h3" textAlign={'center'}>
                                    {t('Things to do')}
                                </Typography>
                                <Todo taskList={taskList || []} />
                            </Grid>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    flexDirection="column"
                                    // justifyContent="space-between"
                                    // spacing={1}
                                >
                                    <Grid item>
                                        <Typography
                                            component="h3"
                                            variant="h3"
                                            textAlign={'center'}
                                        >
                                            {t('Reminders')}
                                        </Typography>
                                        <Reminder companyId={company?.id} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            component="h3"
                                            variant="h3"
                                            textAlign={'center'}
                                        >
                                            {t('Upcoming')}
                                        </Typography>
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
