import { InputLabel } from '@/components/layout/InputLabel';
import { useAppContext, useLocale, usePayPeriodList } from '@/hooks';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { monthBegin } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

type Props = SelectProps<string> & {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name: string;
    disabled?: boolean;
};

export function SelectAccPeriod(props: Props) {
    const { companyId, control, label, id, name, disabled, ...other } = props;
    const { company } = useAppContext();
    const { data } = usePayPeriodList({ companyId });
    const options = useOptions(data, company?.payPeriod ?? monthBegin(new Date()));

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

function useOptions(data: PayPeriod[], currentPayPeriod: Date) {
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
