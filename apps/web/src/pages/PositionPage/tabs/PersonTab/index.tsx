import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePerson } from '@/hooks/queries/usePersons';
import PersonForm from './PersonForm';

interface PersonTabProps {
    personId: number;
}

export default function PersonTab({ personId }: PersonTabProps) {
    const { data, isLoading, isError, error } = usePerson(personId);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PersonForm person={data} />}
        </>
    );
}
