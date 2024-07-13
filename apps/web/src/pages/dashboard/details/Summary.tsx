import { Link } from '@/components/layout/Link';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
// import { getCurrentPayPeriod, getPayPeriodName } from '@/services/payPeriod.service';
import { capitalizeFirstChar, sumFormatter } from '@/services/utils';
import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { sub } from 'date-fns';
import { useTranslation } from 'react-i18next';

export function Summary() {
    const { company } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const { data: payPeriod } = useQuery({
        queryKey: [
            'payPeriod',
            'current',
            { companyId: company?.id, payPeriod: company?.payPeriod },
        ],
        queryFn: async () => {
            return company?.id ? await getCurrentPayPeriod(company.id, true, true) : null;
        },
    });

    const formatUpdatedDate = (date: Date): string => {
        let hours = '' + date.getHours();
        let minutes = '' + date.getMinutes();
        const month = '' + (date.getMonth() + 1);
        const day = '' + date.getDate();
        const year = date.getFullYear();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        const d = new Date(date);
        if (d.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            return `${t('today at')} ${hours}:${minutes} `;
        }
        if (d.setHours(0, 0, 0, 0) === sub(new Date(), { days: 1 }).setHours(0, 0, 0, 0)) {
            return `${t('yesterday at')} ${hours}:${minutes} `;
        }
        return `${day}-${month}-${year} ${t('at')} ${hours}:${minutes} `;
    };

    return (
        <Grid container flexDirection="row">
            {company?.id ? (
                <Grid item xs={12} lg={6} container flexDirection="column">
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
                                        {t('Current payment period')}:{' '}
                                    </Typography>{' '}
                                    <Typography
                                        color={'warning.main'}
                                        sx={{ fontWeight: 'medium', display: 'inline' }}
                                    >
                                        {capitalizeFirstChar(
                                            getPayPeriodName(
                                                payPeriod.dateFrom,
                                                payPeriod.dateTo,
                                                false,
                                                locale.dateLocale,
                                                'LLLL y',
                                            ),
                                        )}
                                    </Typography>
                                </Link>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Grid
                    container
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    spacing={1}
                >
                    <Grid item>
                        <Link to="/profile?tab=details&return=true">
                            <Typography variant="h3" color="primary">
                                {t('welcome-for-a-new-user1')}
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography sx={{ display: 'inline' }}>
                            {t('welcome-for-a-new-user2')}
                        </Typography>{' '}
                    </Grid>
                </Grid>
            )}

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
                    // alignItems={'end'}
                    spacing={1}
                    sx={{ alignItems: { xs: 'start', lg: 'end' } }}
                >
                    <Grid item>
                        {payPeriod?.updatedDate && (
                            <Link to={'/payroll?tab=payroll&return=true'}>
                                <Typography sx={{ textAlign: 'end', display: 'inline' }}>
                                    {t('Calculation was completed')}:{' '}
                                </Typography>{' '}
                                <Typography
                                    sx={{
                                        // textAlign: 'end',
                                        display: 'inline',
                                        fontWeight: 'medium',
                                    }}
                                >
                                    {/* {formatDateTime(payPeriod.updatedDate, locale.dateLocale)} */}
                                    {formatUpdatedDate(payPeriod.updatedDate)}
                                </Typography>
                            </Link>
                        )}
                    </Grid>
                    <Grid item>
                        {payPeriod?.updatedDate && (
                            <Link to={'/payroll?tab=payroll&return=true'}>
                                <Typography
                                    sx={{
                                        // textAlign: { xs: 'start', lg: 'end' },
                                        display: 'inline',
                                    }}
                                >
                                    {t('Total expenses')}:{' '}
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
                                        false,
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
