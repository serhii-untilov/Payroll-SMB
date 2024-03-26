import { MenuItem, Select, SelectProps } from '@mui/material';
import useAppContext from '../../hooks/useAppContext';
import { IPayPeriod } from '@repo/shared';
import { useQuery } from 'react-query';
import { getPayPeriodList } from '../../services/payPeriod.service';
import { formatPeriod } from '@repo/utils';

export type PayPeriodOption = {
    label: string;
    value: any;
};

export function PayPeriod(props: SelectProps) {
    const { company, payPeriod, setPayPeriod } = useAppContext();

    const {
        data: payPeriodList,
        isError: isPayPeriodListError,
        isLoading: isPayPeriodListLoading,
        error: payPeriodListError,
    } = useQuery<IPayPeriod[], Error>({
        queryKey: 'payPeriodList',
        queryFn: async () => {
            return getPayPeriodList(company?.id || 0);
        },
        enabled: !!company?.id,
    });

    const generateOptions = () => {
        return payPeriodList?.map((option: any) => {
            return (
                <MenuItem key={option.id} value={option.id}>
                    {formatPeriod(option.dateFrom, option.dateTo)}
                </MenuItem>
            );
        });
    };

    if (isPayPeriodListLoading) {
        return <></>;
    }

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            onChange={(e) => setPayPeriod(payPeriodList?.find((o) => o.id === e.target.value))}
            value={payPeriod?.id}
            // sx={{ mb: 2 }}
            {...props}
            label={''}
        >
            {generateOptions()}
        </Select>
    );
}
