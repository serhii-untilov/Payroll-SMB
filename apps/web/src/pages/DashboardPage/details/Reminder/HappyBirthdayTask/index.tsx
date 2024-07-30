import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { usePerson } from '@/hooks/queries/usePersons';
import { Task } from '@repo/openapi';
import HappyBirthdayCard from './HappyBirthdayCard';

type HappyBirthdayTaskProps = {
    task: Task;
    personId: number;
};

export default function HappyBirthdayTask({ task, personId }: HappyBirthdayTaskProps) {
    const { data: person, isError, error } = usePerson(personId);
    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {person && <HappyBirthdayCard task={task} person={person} />}
        </>
    );
}
