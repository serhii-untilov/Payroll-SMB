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
                    <Grid
                        container
                        flexDirection={'column'}
                        justifyContent={'space-between'}
                        spacing={1}
                    >
                        {company?.id && (
                            <Grid item>
                                <Link to={`/company/${company.id}?tab=details&return=true`}>
                                    <Typography variant="h3" color="primary">
                                        {company.name}
                                    </Typography>
                                </Link>
                            </Grid>
                        )}
                        {payPeriod?.dateTo && (
                            <Grid item>
                                <Link to={`/company/${company.id}?tab=periods&return=true`}>
                                    <Typography sx={{ display: 'inline' }}>
                                        Поточний розрахунковий період:{' '}
                                    </Typography>{' '}
                                    <Typography
                                        color={'warning.main'}
                                        sx={{ fontWeight: 'medium', display: 'inline' }}
                                    >
                                        {getPayPeriodName(
                                            payPeriod.dateFrom,
                                            payPeriod.dateTo,
                                            false,
                                            locale.dateLocale,
                                        )}
                                    </Typography>
                                </Link>
                            </Grid>
                        )}
                    </Grid>
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
                <Grid
                    container
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    alignItems={'end'}
                    spacing={1}
                >
                    <Grid item>
                        {payPeriod?.updatedDate && (
                            <Link to={'/payroll?tab=payroll&return=true'}>
                                <Typography sx={{ textAlign: 'end', display: 'inline' }}>
                                    Розрахунок виконано:{' '}
                                </Typography>{' '}
                                <Typography sx={{ textAlign: 'end', display: 'inline' }}>
                                    {formatDateTime(payPeriod.updatedDate, locale.dateLocale)}
                                </Typography>
                            </Link>
                        )}
                    </Grid>
                    <Grid item>
                        {payPeriod?.updatedDate && (
                            <Link to={'/payroll?tab=employer&return=true'}>
                                <Typography sx={{ textAlign: 'end', display: 'inline' }}>
                                    Загальні витрати:{' '}
                                </Typography>
                                <Typography
                                    color={'warning.main'}
                                    sx={{
                                        textAlign: 'end',
                                        fontWeight: 'medium',
                                        display: 'inline',
                                    }}
                                >
                                    {sumFormatter(
                                        Number(payPeriod.accruals) + Number(payPeriod.funds),
                                    )}
                                </Typography>
                            </Link>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
