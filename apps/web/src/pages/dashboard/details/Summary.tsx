import { Box, Grid, Typography } from '@mui/material';
import { IPayPeriod, formatDateTime, getPeriodName, monthBegin } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { Link } from '../../../components/layout/Link';
import useAppContext from '../../../hooks/useAppContext';
import { getCurrentPayPeriod, getPayPeriodName } from '../../../services/payPeriod.service';
import { useQuery } from '@tanstack/react-query';
import useLocale from '../../../hooks/useLocale';
import { sumFormatter } from '../../../services/utils';

export function Summary() {
    const { company } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const { data: payPeriod } = useQuery({
        queryKey: ['pay-period', 'current', company],
        queryFn: async () => {
            return company?.id ? await getCurrentPayPeriod(company.id, true, true) : null;
        },
    });

    return (
        <Grid container flexDirection="row">
            <Grid item xs={6} container flexDirection="column">
                {company?.id ? (
                    <Box>
                        {company?.id && (
                            <Link to={`/company/${company.id}`}>
                                <Typography variant="h3" color="primary">
                                    {company.name}
                                </Typography>
                            </Link>
                        )}
                        {payPeriod?.dateTo && (
                            <Typography color={'warning.main'} sx={{ fontWeight: 'bold' }}>
                                {getPayPeriodName(
                                    payPeriod.dateFrom,
                                    payPeriod.dateTo,
                                    false,
                                    locale.dateLocale,
                                )}
                            </Typography>
                        )}
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
                {payPeriod?.updatedDate && (
                    <Link to={'/payroll?tab=payroll&return=true'}>
                        <Grid container flexDirection={'row'} justifyContent={'space-between'}>
                            <Typography sx={{ textAlign: 'end' }}>Розрахунок виконано: </Typography>{' '}
                            <Typography sx={{ textAlign: 'end' }}>
                                {formatDateTime(payPeriod.updatedDate, locale.dateLocale)}
                            </Typography>
                        </Grid>
                        <Grid container flexDirection={'row'} justifyContent={'space-between'}>
                            <Typography sx={{ textAlign: 'end' }}>Загальні витрати: </Typography>
                            <Typography
                                color={'warning.main'}
                                sx={{ textAlign: 'end', fontWeight: 'medium' }}
                            >
                                {sumFormatter(Number(payPeriod.accruals) + Number(payPeriod.funds))}
                            </Typography>
                        </Grid>
                    </Link>
                )}
            </Grid>
        </Grid>
    );
}
