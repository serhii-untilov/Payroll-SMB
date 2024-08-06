import { useGetPersonList } from '@/hooks/queries/usePerson';
import ErrorDisplay from './../ErrorDisplay';
import { SelectPersonForm } from './SelectPersonForm';

interface SelectPersonProps {
    name: string;
    control: any;
    label: string;
    autoFocus?: boolean;
}

export default function SelectPerson(props: SelectPersonProps) {
    const { data, isError, error } = useGetPersonList();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectPersonForm {...props} personList={data} />}
        </>
    );
}
