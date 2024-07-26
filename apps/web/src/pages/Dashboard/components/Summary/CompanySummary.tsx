import CompanyName from '@/components/domain/CompanyName';
import { Box, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Company } from '@repo/openapi';
import CalcDate from './CalcDate';
import PayPeriod from './PayPeriod';
import TotalExpenses from './TotalExpenses';

type SummaryProps = {
    company: Company;
};

const CompanySummary = ({ company }: SummaryProps) => {
    return (
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
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid grey' : ''),
            }}
        >
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
        </Box>
    );
};

export default CompanySummary;
