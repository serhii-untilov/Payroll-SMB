import useLocale from '@/hooks/useLocale';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';

export function useOptions(data: PayPeriod[], currentPayPeriod: Date) {
    const { locale } = useLocale();
    return useMemo(
        () =>
            data?.map((period: any) => {
                return (
                    <MenuItem
                        key={format(period.dateFrom, 'yyyy-MM-dd')}
                        value={format(period.dateFrom, 'yyyy-MM-dd')}
                    >
                        {getPayPeriodName(
                            period.dateFrom,
                            period.dateTo,
                            isEqual(period.dateFrom, currentPayPeriod),
                            locale.dateLocale,
                        )}
                    </MenuItem>
                );
            }),
        [locale, data, currentPayPeriod],
    );
}
