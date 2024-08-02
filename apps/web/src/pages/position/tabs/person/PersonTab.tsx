import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePerson } from '@/hooks/queries/usePersons';
import PersonForm from './PersonForm';

const PersonTab = ({ personId }) => {
    const { data, isLoading, isError, error } = usePerson(personId);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PersonForm person={data} />}
        </>
    );
};

export default PersonTab;
