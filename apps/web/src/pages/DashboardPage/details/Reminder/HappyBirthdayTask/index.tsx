import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { usePerson } from '@/hooks/queries/usePersons';
import { Task } from '@repo/openapi';
import HappyBirthdayCard from './HappyBirthdayCard';

type HappyBirthdayTaskProps = {
    task: Task;
    personId: number;
};

export default function HappyBirthdayTask({ task, personId }: HappyBirthdayTaskProps) {
    const { data: person, isLoading, isError, error } = usePerson(personId);
    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {person && <HappyBirthdayCard task={task} person={person} />}
        </>
    );
}
