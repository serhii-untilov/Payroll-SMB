import { MenuItem, Select, SelectProps } from '@mui/material';
import { IPayPeriod, monthBegin } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { format, isEqual } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPayPeriodList, getPayPeriodName } from '../../services/payPeriod.service';

export type PayPeriodOption = SelectProps<string> & {
    companyId: number | undefined;
};

export function SelectPayPeriod(props: PayPeriodOption) {
    const { companyId, ...other } = props;
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const { locale } = useLocale();

    const { data, isError, isLoading, error } = useQuery<IPayPeriod[], Error>({
        queryKey: ['payPeriod', 'list', { companyId }],
        queryFn: async () => await getPayPeriodList(companyId),
    });

    const options = useMemo(() => {
        return data?.map((period: any) => {
            return (
                <MenuItem
                    key={format(period.dateFrom, 'yyyy-MM-dd')}
                    value={format(period.dateFrom, 'yyyy-MM-dd')}
                >
                    {getPayPeriodName(
                        period.dateFrom,
                        period.dateTo,
                        isEqual(period.dateFrom, company?.payPeriod),
                        locale.dateLocale,
                    )}
                </MenuItem>
            );
        });
    }, [data, company, locale.dateLocale]);

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    // if (isLoading) {
    //     return <Skeleton animation={'wave'} />;
    // }

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            native={false}
            onChange={(event: any) => setPayPeriod(new Date(event.target.value))}
            value={format(payPeriod || monthBegin(new Date()), 'yyyy-MM-dd')}
            {...other}
            label={''}
        >
            {options}
        </Select>
    );
}
