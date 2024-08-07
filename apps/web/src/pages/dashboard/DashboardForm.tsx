import GreetingUser from '@/components/GreetingUser';
import PageLayout from '@/components/layout/PageLayout';
import SupportCenter from '@/components/SupportCenter';
import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import { selectThemeMode } from '@/store/slices/themeModeSlice';
import { useAppSelector } from '@/store/store.hooks';
import { Grid } from '@mui/material';
import { Company, PayPeriod, Task } from '@repo/openapi';
import { useEffect } from 'react';
import ReminderSection from './sections/reminder/ReminderSection';
import SummarySection from './sections/summary/SummarySection';
import TodoSection from './sections/todo/TodoSection';
import UpcomingSection from './sections/upcoming/UpcomingSection';

type DashboardFormProps = {
    company?: Company;
    payPeriod?: PayPeriod;
    taskList: Task[];
};

const DashboardForm = ({ company, payPeriod, taskList }: DashboardFormProps) => {
    const themeMode = useAppSelector(selectThemeMode);
    const { user } = useAuth();
    const { locale } = useLocale();
    useEffect(() => {}, [locale, themeMode]);

    return (
        <>
            <PageLayout>
                <Grid container flexDirection="column" alignItems="space-between" spacing={2}>
                    <Grid item>
                        <GreetingUser user={user} />
                        <SupportCenter />
                        {company && <SummarySection {...{ company, payPeriod }} />}
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            flexDirection="row"
                            justifyContent="space-around"
                            spacing={3}
                        >
                            <Grid item xs={12} md={6}>
                                <TodoSection taskList={taskList} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container flexDirection="column">
                                    <Grid item>
                                        <ReminderSection taskList={taskList} />
                                    </Grid>
                                    <Grid item>
                                        <UpcomingSection taskList={taskList} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PageLayout>
        </>
    );
};

export default DashboardForm;
