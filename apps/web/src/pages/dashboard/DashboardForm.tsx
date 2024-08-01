import GreetingUser from '@/components/GreetingUser';
import PageLayout from '@/components/layout/PageLayout';
import SupportCenter from '@/components/SupportCenter';
import { Grid } from '@mui/material';
import { Company, PayPeriod, Task } from '@repo/openapi';
import ReminderSection from './sections/reminder/ReminderSection';
import SummarySection from './sections/summary/SummarySection';
import Todo from './sections/Todo';
import Upcoming from './sections/Upcoming';
import { useAuth } from '@/hooks/context/useAuth';

type DashboardFormProps = {
    company?: Company;
    payPeriod?: PayPeriod;
    taskList: Task[];
};

const DashboardForm = ({ company, payPeriod, taskList }: DashboardFormProps) => {
    const { user } = useAuth();
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
                                <Todo taskList={taskList} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container flexDirection="column">
                                    <Grid item>
                                        <ReminderSection taskList={taskList} />
                                    </Grid>
                                    <Grid item>
                                        <Upcoming taskList={taskList} />
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
