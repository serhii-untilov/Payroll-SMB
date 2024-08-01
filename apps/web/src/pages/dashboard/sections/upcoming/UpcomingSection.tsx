import { Task } from '@repo/openapi';
import useUpcoming from '../../hooks/useUpcoming';
import UpcomingList from './UpcomingList';

const UpcomingSection = (props: { taskList: Task[] }) => {
    const taskList = useUpcoming(props.taskList);
    return <>{!!taskList.length && <UpcomingList taskList={taskList} />}</>;
};

export default UpcomingSection;
