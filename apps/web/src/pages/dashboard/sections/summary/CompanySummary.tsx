import CompanyName from '@/components/CompanyName';
import CurrentPayPeriod from '@/components/CurrentPayPeriod';
import PayPeriodTotalExpenses from '@/components/PayPeriodTotalExpenses';
import PayrollCalcDate from '@/components/PayrollCalcDate';
import { Grid } from '@mui/material';

const CompanySummary = ({ company, payPeriod }) => {
    return (
        <Grid container flexDirection="row">
            <Grid item xs={12} lg={6} container flexDirection="column">
                <Grid
                    container
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    spacing={1}
                >
                    <Grid item>
                        <CompanyName company={company} />
                    </Grid>
                    <Grid item>
                        {payPeriod && <CurrentPayPeriod {...{ company, payPeriod }} />}
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                item
                xs={12}
                lg={6}
                container
                flexDirection="column"
                justifyContent="center"
                alignContent={'end'}
            >
                <Grid
                    container
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    spacing={1}
                    sx={{ alignItems: { xs: 'start', lg: 'end' } }}
                >
                    <Grid item>{company && <PayrollCalcDate payPeriod={payPeriod} />}</Grid>
                    <Grid item>{company && <PayPeriodTotalExpenses payPeriod={payPeriod} />}</Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CompanySummary;
