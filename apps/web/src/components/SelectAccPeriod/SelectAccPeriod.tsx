import { useGetPayPeriodList } from '@/hooks/queries/usePayPeriod';
import { SelectProps } from '@mui/material';
import ErrorDisplay from './../ErrorDisplay';
import SelectAccPeriodForm from './SelectAccPeriodForm';

type Props = SelectProps<string> & {
    companyId: string;
    control: any;
    label?: string;
    id?: string;
    name: string;
    disabled?: boolean;
};

const SelectAccPeriod = (props: Props) => {
    const { companyId } = props;
    const { data, isError, error } = useGetPayPeriodList({ companyId });

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectAccPeriodForm {...props} data={data} />}
        </>
    );
};

export default SelectAccPeriod;
