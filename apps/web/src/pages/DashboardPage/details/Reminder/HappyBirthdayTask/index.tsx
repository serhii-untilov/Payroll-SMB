import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import { usePerson } from '@/hooks/queries/usePersons';
import { Task } from '@repo/openapi';
import HappyBirthdayCard from './HappyBirthdayCard';

type HappyBirthdayTaskProps = {
    task: Task;
    personId: number;
};

const HappyBirthdayTask = ({ task, personId }: HappyBirthdayTaskProps) => {
    const { data: person, isLoading, isError, error } = usePerson(personId);
    return (
        <>
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
            {person && <HappyBirthdayCard task={task} person={person} />}
        </>
    );
};

export default HappyBirthdayTask;
