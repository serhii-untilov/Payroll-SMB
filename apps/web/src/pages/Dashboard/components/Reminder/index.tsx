import { Task } from '@repo/openapi';
import useReminder from '../../hooks/useReminder';
import { ReminderCard } from './ReminderCard';

type Props = {
    taskList: Task[];
};

export default function Reminder(props: Props) {
    const taskList: Task[] = useReminder(props.taskList);

    return <>{taskList.length && <ReminderCard taskList={taskList} />}</>;
}
