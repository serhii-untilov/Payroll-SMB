import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { formatDate, monthBegin, toDate } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';

export type PayPeriodOption = SelectProps<string> & {
    companyId: number | undefined;
};

export function SelectPayPeriod(props: PayPeriodOption) {
    const { companyId, ...other } = props;
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const { locale } = useLocale();
    const { data, isLoading } = usePayPeriodList({ companyId });

    const options = useMemo(() => {
        return data?.map((period: any) => {
            return (
                <MenuItem key={formatDate(period.dateFrom)} value={formatDate(period.dateFrom)}>
                    {getPayPeriodName(
                        toDate(period.dateFrom),
                        toDate(period.dateTo),
                        isEqual(period.dateFrom, company?.payPeriod),
                        locale.dateLocale,
                    )}
                </MenuItem>
            );
        });
    }, [data, company, locale.dateLocale]);

    if (isLoading) {
        return null;
    }

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            native={false}
            onChange={(event: any) => setPayPeriod(new Date(event.target.value))}
            value={options?.length ? format(payPeriod || monthBegin(new Date()), 'yyyy-MM-dd') : ''}
            {...other}
            label={''}
        >
            {options}
        </Select>
    );
}
