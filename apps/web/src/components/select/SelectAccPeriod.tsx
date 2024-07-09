import { InputLabel } from '@/components/layout/InputLabel';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { getPayPeriodList, getPayPeriodName } from '@/services/payPeriod.service';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { IPayPeriod, monthBegin } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { format, isEqual } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
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

    const { data, isError, error } = useQuery<IPayPeriod[], Error>({
        queryKey: ['payPeriod', 'list', { companyId, payPeriod: company?.payPeriod }],
        queryFn: async () => await getPayPeriodList(companyId),
    });

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

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

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
