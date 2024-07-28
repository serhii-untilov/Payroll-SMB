import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
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
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {data && <SelectPersonForm {...props} personList={data} />}
        </>
    );
}
