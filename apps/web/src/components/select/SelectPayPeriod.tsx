import { useAppContext, useLocale } from '@/hooks';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { formatDate, monthBegin, toDate } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';

type Props = SelectProps<string> & {
    companyId: number | undefined;
};

export function SelectPayPeriod(props: Props) {
    const { companyId, ...other } = props;
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const { data, isLoading } = usePayPeriodList({ companyId });
    const options = useOptions(data, company?.payPeriod ?? monthBegin(new Date()));

    if (isLoading) return null;

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

function useOptions(data: PayPeriod[], currentPayPeriod: Date) {
    const { locale } = useLocale();
    return useMemo(() => {
        return data?.map((period: any) => {
            return (
                <MenuItem key={formatDate(period.dateFrom)} value={formatDate(period.dateFrom)}>
                    {getPayPeriodName(
                        toDate(period.dateFrom),
                        toDate(period.dateTo),
                        isEqual(period.dateFrom, currentPayPeriod),
                        locale.dateLocale,
                    )}
                </MenuItem>
            );
        });
    }, [data, currentPayPeriod, locale.dateLocale]);
}
