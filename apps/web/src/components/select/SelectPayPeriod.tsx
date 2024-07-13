import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { monthBegin } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';

export type PayPeriodOption = SelectProps<string> & {
    companyId: number | undefined;
};

export function SelectPayPeriod(props: PayPeriodOption) {
    const { companyId, ...other } = props;
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const { locale } = useLocale();
    const { data } = usePayPeriodList({ companyId });

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
