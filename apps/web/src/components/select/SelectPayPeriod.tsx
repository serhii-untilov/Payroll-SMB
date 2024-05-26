import { MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material';
import { IPayPeriod } from '@repo/shared';
import { format, isEqual, startOfMonth } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from '@tanstack/react-query';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPayPeriodList, getPayPeriodName } from '../../services/payPeriod.service';
import { Skeleton } from '../layout/Skeleton';

export type PayPeriodOption = SelectProps & {
    companyId: number | undefined;
};

export function SelectPayPeriod(props: PayPeriodOption) {
    const { companyId, value } = props;
    const { company: currentCompany, setPayPeriod } = useAppContext();
    const { locale } = useLocale();

    const { data, isError, isLoading, error } = useQuery<IPayPeriod[], Error>({
        queryKey: ['payPeriod', 'list', { companyId }],
        queryFn: async () => await getPayPeriodList(companyId),
    });

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    if (isLoading) {
        return <Skeleton animation={'wave'} />;
    }

    const generateOptions = () => {
        return data?.map((period: any) => {
            return (
                <MenuItem
                    key={format(period.dateFrom, 'yyyy-MM-dd')}
                    value={format(period.dateFrom, 'yyyy-MM-dd')}
                >
                    {getPayPeriodName(
                        period.dateFrom,
                        period.dateTo,
                        isEqual(period.dateFrom, currentCompany?.payPeriod),
                        locale.dateLocale,
                    )}
                </MenuItem>
            );
        });
    };

    const onChange = (event: any) => {
        if (companyId === currentCompany?.id) {
            setPayPeriod(new Date(event.target.value));
            localStorage.setItem('payPeriod', event.target.value);
        }
    };

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            onChange={onChange}
            value={value}
            {...props}
            label={''}
        >
            {generateOptions()}
        </Select>
    );
}
