import { Box, Grid, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { ITask } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../../components/layout/Link';
import PageLayout from '../../components/layout/PageLayout';
import { Loading } from '../../components/utility/Loading';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getTaskList } from '../../services/task.service';
import { Greeting } from './details/Greeting';
import { Reminder } from './details/Reminder';
import { Summary } from './details/Summary';
import { Todo } from './details/Todo';
import { Upcoming } from './details/Upcoming';

export default function Dashboard() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, themeMode } = useAppContext();

    useEffect(() => {}, [locale, themeMode]);

    const {
        data: taskList,
        isError,
        isLoading,
        error,
    } = useQuery<ITask[], Error>({
        queryKey: ['task', 'list', { companyId: company?.id }],
        queryFn: async () => {
            return await getTaskList(company?.id ? { companyId: company?.id } : {});
        },
        // enabled: !!company?.id,
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
                                mx: { xs: 1, sm: 2, md: 8, lg: 18 },
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
