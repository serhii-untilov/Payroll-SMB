import useLocale from '@/hooks/useLocale';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { formatDate, toDate } from '@repo/shared';
import { isEqual } from 'date-fns';
import { useMemo } from 'react';

export default function usePayPeriodOptions(data: PayPeriod[] | undefined, currentPayPeriod: Date) {
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
