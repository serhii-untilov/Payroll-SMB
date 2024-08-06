import { Task } from '@repo/openapi';
import useReminder from '@/hooks/useReminder';
import ReminderList from './ReminderList';

const ReminderSection = (props: { taskList: Task[] }) => {
    const taskList: Task[] = useReminder(props.taskList);
    return <>{!!taskList.length && <ReminderList taskList={taskList} />}</>;
};

export default ReminderSection;
