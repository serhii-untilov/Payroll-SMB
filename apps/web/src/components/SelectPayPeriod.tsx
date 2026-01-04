import { useGetPayPeriodList } from '@/hooks/queries/usePayPeriod';
import usePayPeriodOptions from '@/hooks/usePayPeriodOptions';
import { selectCompany } from '@/store/slices/companySlice';
import { selectPayPeriod, setPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppDispatch, useAppSelector } from '@/store/store.hooks';
import { Select, SelectProps } from '@mui/material';
import { monthBegin } from '@repo/shared';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import ErrorDisplay from './ErrorDisplay';

type SelectPayPeriodProps = SelectProps<string> & {
    companyId: string | undefined;
};

export default function SelectPayPeriod(props: SelectPayPeriodProps) {
    const { companyId, ...other } = props;
    const { data, isError, error } = useGetPayPeriodList({ companyId });
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);
    const dispatch = useAppDispatch();
    const options = usePayPeriodOptions(data, company?.payPeriod ?? monthBegin(new Date()));
    const value = useMemo(
        () => (options?.length ? format(payPeriod?.dateFrom ?? monthBegin(new Date()), 'yyyy-MM-dd') : ''),
        [options?.length, payPeriod?.dateFrom],
    );
    const onChangePeriod = useCallback(
        (date: Date) => {
            const payPeriod = data?.find((o) => o.dateFrom.getTime() === date.getTime());
            if (payPeriod) {
                dispatch(setPayPeriod(payPeriod));
            }
        },
        [data, dispatch],
    );

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <Select
                    size="small"
                    margin="none"
                    fullWidth
                    native={false}
                    onChange={(event: any) => onChangePeriod(new Date(event.target.value))}
                    value={value}
                    label={''}
                    {...other}
                >
                    {options}
                </Select>
            )}
        </>
    );
}
