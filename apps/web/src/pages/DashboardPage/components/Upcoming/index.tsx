import { Task } from '@repo/openapi';
import useUpcoming from '../../hooks/useUpcoming';
import UpcomingList from './UpcomingList';

type Props = {
    taskList: Task[];
};

export default function Upcoming(props: Props) {
    const taskList = useUpcoming(props.taskList);

    return <>{!!taskList.length && <UpcomingList taskList={taskList} />}</>;
}
