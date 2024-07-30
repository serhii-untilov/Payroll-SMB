import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { SelectProps } from '@mui/material';
import SelectAccPeriodForm from './form/SelectAccPeriodForm';

type Props = SelectProps<string> & {
    companyId: number;
    control: any;
    label?: string;
    id?: string;
    name: string;
    disabled?: boolean;
};

export default function SelectAccPeriod(props: Props) {
    const { companyId } = props;
    const { data, isError, error } = usePayPeriods({ companyId });

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectAccPeriodForm {...props} data={data} />}
        </>
    );
}
