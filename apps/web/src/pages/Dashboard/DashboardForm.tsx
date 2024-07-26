import PageLayout from '@/components/layout/PageLayout';
import { Grid } from '@mui/material';
import { Company, Task } from '@repo/openapi';
import Greeting from './components/Greeting';
import Reminder from './components/Reminder';
import Summary from './components/Summary';
import SupportCenter from './components/SupportCenter';
import Todo from './components/Todo';
import Upcoming from './components/Upcoming';
import { useAppContext } from '@/hooks/useAppContext';

interface DashboardFormProps {
    taskList: Task[];
}

const DashboardForm = ({ taskList }: DashboardFormProps) => {
    const { company } = useAppContext();
    return (
        <>
            <PageLayout>
                <Grid container flexDirection="column" alignItems="space-between" spacing={2}>
                    <Grid item>
                        <Greeting />
                        <SupportCenter />
                        {company && <Summary />}
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
                                        <Todo taskList={taskList} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container flexDirection="column">
                                    <Grid item>
                                        <Reminder taskList={taskList} />
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
