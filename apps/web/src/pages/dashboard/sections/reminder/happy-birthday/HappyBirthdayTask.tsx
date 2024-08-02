import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { usePerson } from '@/hooks/queries/usePersons';
import HappyBirthdayCard from './HappyBirthdayCard';

const HappyBirthdayTask = ({ task, personId }) => {
    const { data: person, isError, error } = usePerson(personId);
    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {person && <HappyBirthdayCard task={task} person={person} />}
        </>
    );
};

export default HappyBirthdayTask;
