import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { SelectProps } from '@mui/material';
import SelectAccPeriodForm from './form/SelectAccPeriodForm';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';

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
    const { data, isLoading, isError, error } = usePayPeriods({ companyId });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectAccPeriodForm {...props} data={data} />}
        </>
    );
}
