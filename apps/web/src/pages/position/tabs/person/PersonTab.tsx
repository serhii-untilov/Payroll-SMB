import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetPerson } from '@/hooks/queries/usePerson';
import PersonForm from './PersonForm';

const PersonTab = ({ personId }) => {
    const { data, isLoading, isError, error } = useGetPerson(personId);

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && <PersonForm person={data} />}
        </>
    );
};

export default PersonTab;
