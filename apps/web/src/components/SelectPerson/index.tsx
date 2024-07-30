import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { usePersons } from '@/hooks/queries/usePersons';
import { SelectPersonForm } from './form/SelectPersonForm';

interface SelectPersonProps {
    name: string;
    control: any;
    label: string;
    autoFocus?: boolean;
}

export default function SelectPerson(props: SelectPersonProps) {
    const { data, isError, error } = usePersons();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectPersonForm {...props} personList={data} />}
        </>
    );
}
