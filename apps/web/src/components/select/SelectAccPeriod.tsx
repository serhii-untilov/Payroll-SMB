import { InputLabel } from '@/components/layout/InputLabel';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { monthBegin } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

export type PayPeriodOption = SelectProps<string> & {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name: string;
    disabled?: boolean;
};

export function SelectAccPeriod(props: PayPeriodOption) {
    const { companyId, control, label, id, name, disabled, ...other } = props;
    const { company } = useAppContext();
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
        <>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { value } }) => {
                    return (
                        <Select
                            disabled={!!disabled}
                            size="small"
                            margin="none"
                            fullWidth
                            native={false}
                            onChange={(event: any) => new Date(event.target.value)}
                            value={
                                options?.length
                                    ? format(value || monthBegin(new Date()), 'yyyy-MM-dd')
                                    : ''
                            }
                            {...other}
                            label={''}
                        >
                            {options}
                        </Select>
                    );
                }}
            />
        </>
    );
}
