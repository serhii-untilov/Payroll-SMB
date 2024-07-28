import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePersons } from '@/hooks/queries/usePersons';
import { SelectPersonForm } from './form/SelectPersonForm';

interface SelectPersonProps {
    name: string;
    control: any;
    label: string;
    autoFocus?: boolean;
}

export default function SelectPerson(props: SelectPersonProps) {
    const { data, isLoading, isError, error } = usePersons();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <SelectPersonForm {...props} personList={data} />}
        </>
    );
}
