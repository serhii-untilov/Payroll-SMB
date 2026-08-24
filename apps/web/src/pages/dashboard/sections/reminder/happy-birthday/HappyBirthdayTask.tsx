import ErrorDisplay from '@/components/ErrorDisplay';
import { useGetPerson } from '@/hooks/queries/usePerson';
import { Task } from '@repo/openapi';
import HappyBirthdayCard from './HappyBirthdayCard';

const HappyBirthdayTask = ({ task, personId }: { task: Task; personId: string }) => {
    const { data: person, isError, error } = useGetPerson(personId);
    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {person && <HappyBirthdayCard task={task} person={person} />}
        </>
    );
};

export default HappyBirthdayTask;
