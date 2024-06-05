import { Box, Grid, Typography } from '@mui/material';
import { getPeriodName, monthBegin } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../components/layout/Link';
import useAppContext from '../../../hooks/useAppContext';

export function Summary() {
    const { company, payPeriod } = useAppContext();
    const { t } = useTranslation();
    const payCalcDate = new Date();

    return (
        <Grid container flexDirection="row">
            <Grid item xs={6} container flexDirection="column">
                {company?.id ? (
                    <Box>
                        <Link to={`/company/${company.id}`}>
                            <Typography variant="h3" color="primary">
                                {company?.name}
                            </Typography>
                        </Link>
                        <Typography
                            color={
                                payPeriod && payPeriod.getTime() < monthBegin(new Date()).getTime()
                                    ? 'warning.main'
                                    : ''
                            }
                            sx={{ fontWeight: 'bold' }}
                        >
                            {getPeriodName(payPeriod || new Date())}
                        </Typography>
                    </Box>
                ) : (
                    t('create-company')
                )}
            </Grid>
            <Grid
                item
                xs={6}
                container
                flexDirection="column"
                justifyContent="center"
                alignContent={'end'}
            >
                <Link to={'/payroll'}>
                    <Typography sx={{ textAlign: 'end' }}>
                        Зарплата розрахована: {payCalcDate.toDateString()}
                    </Typography>
                </Link>
                {/* {user && (
                    <Typography color={'text.primary'} sx={{ textAlign: 'end' }}>
                        Розрахунок виконав: {user?.firstName} {user?.lastName}
                    </Typography>
                )} */}
            </Grid>
        </Grid>
    );
}
