import CompanyName from '@/components/CompanyName';
import { Grid } from '@mui/material';
import { Company } from '@repo/openapi';
import CalcDate from './CalcDate';
import PayPeriod from './PayPeriod';
import TotalExpenses from './TotalExpenses';

type SummaryProps = {
    company: Company;
};

export default function CompanySummary({ company }: SummaryProps) {
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
                        <PayPeriod companyId={company.id} />
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
                    <Grid item>{company && <CalcDate companyId={company.id} />}</Grid>
                    <Grid item>{company && <TotalExpenses companyId={company.id} />}</Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
