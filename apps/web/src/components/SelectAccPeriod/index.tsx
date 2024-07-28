import Error from '@/components/utility/Error';
import { usePayPeriods } from '@/hooks/queries/usePayPeriods';
import { SelectProps } from '@mui/material';
import SelectAccPeriodForm from './form/SelectAccPeriodForm';
import { Loading } from '@/components/utility/Loading';

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
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <SelectAccPeriodForm {...props} data={data} />}
        </>
    );
}
