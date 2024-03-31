import { MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material';
import { IPayPeriod } from '@repo/shared';
import { isEqual } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPayPeriodList, getPayPeriodName } from '../../services/payPeriod.service';
import { Skeleton } from './Skeleton';

export type PayPeriodOption = {
    label: string;
    value: Date;
};

export function SelectPayPeriod(props: SelectProps) {
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const { locale } = useLocale();
    const { data, isError, isLoading, error } = useQuery<IPayPeriod[], Error>({
        queryKey: 'payPeriodList',
        queryFn: async () => getPayPeriodList(company?.id || 0),
        enabled: !!company?.id,
    });

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
        return <Skeleton />;
    }

    if (isLoading) {
        return <Skeleton animation={'wave'} />;
    }

    const generateOptions = () => {
        return data?.map((period: any) => {
            return (
                <MenuItem key={period.id} value={period.id}>
                    {/* {formatPeriod(period.dateFrom, period.dateTo)} */}
                    {getPayPeriodName(
                        period,
                        isEqual(period.dateFrom, company?.payPeriod),
                        locale.dateLocale,
                    )}
                </MenuItem>
            );
        });
    };

    const onChange = (event: any) => {
        setPayPeriod(event.target.value);
    };

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            onChange={onChange}
            value={payPeriod}
            // sx={{ mb: 2 }}
            {...props}
            label={''}
        >
            {generateOptions()}
        </Select>
    );
}
