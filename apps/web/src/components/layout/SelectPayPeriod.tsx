import { MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material';
import { IPayPeriod } from '@repo/shared';
import { formatPeriod } from '@repo/utils';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import useAppContext from '../../hooks/useAppContext';
import { getPayPeriodList } from '../../services/payPeriod.service';
import { Skeleton } from './Skeleton';

export type PayPeriodOption = {
    label: string;
    value: number;
};

export function SelectPayPeriod(props: SelectProps) {
    const { company, payPeriod, setPayPeriod } = useAppContext();
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

    // if (!data || !data.length) {
    //     return <Skeleton variant="rounded" />;
    // }

    const generateOptions = () => {
        return data?.map((period: any) => {
            return (
                <MenuItem key={period.id} value={period.id}>
                    {formatPeriod(period.dateFrom, period.dateTo)}
                </MenuItem>
            );
        });
    };

    const onChange = (event: SelectChangeEvent<unknown>) => {
        setPayPeriod(data?.find((o) => o.id === event.target.value));
    };

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            onChange={onChange}
            value={payPeriod?.id}
            // sx={{ mb: 2 }}
            {...props}
            label={''}
        >
            {generateOptions()}
        </Select>
    );
}
