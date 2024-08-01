import GreetingUser from '@/components/GreetingUser';
import PageLayout from '@/components/layout/PageLayout';
import SupportCenter from '@/components/SupportCenter';
import useAppContext from '@/hooks/context/useAppContext';
import { Grid } from '@mui/material';
import Reminder from './sections/Reminder';
import Summary from './sections/Summary';
import Todo from './sections/Todo';
import Upcoming from './sections/Upcoming';

const DashboardForm = ({ taskList }) => {
    const { company } = useAppContext();
    return (
        <>
            <PageLayout>
                <Grid container flexDirection="column" alignItems="space-between" spacing={2}>
                    <Grid item>
                        <GreetingUser />
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
