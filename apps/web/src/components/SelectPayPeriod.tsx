import ErrorDisplay from '@/components/utility/ErrorDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import usePayPeriodOptions from '@/hooks/usePayPeriodOptions';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { Select, SelectProps } from '@mui/material';
import { monthBegin } from '@repo/shared';
import { format } from 'date-fns';

type SelectPayPeriodProps = SelectProps<string> & {
    companyId: number | undefined;
};

export default function SelectPayPeriod(props: SelectPayPeriodProps) {
    const { companyId, ...other } = props;
    const { data, isError, error } = usePayPeriods({ companyId });
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const options = usePayPeriodOptions(data, company?.payPeriod ?? monthBegin(new Date()));

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <Select
                    size="small"
                    margin="none"
                    fullWidth
                    native={false}
                    onChange={(event: any) => setPayPeriod(new Date(event.target.value))}
                    value={
                        options?.length
                            ? format(payPeriod || monthBegin(new Date()), 'yyyy-MM-dd')
                            : ''
                    }
                    label={''}
                    {...other}
                >
                    {options}
                </Select>
            )}
        </>
    );
}
