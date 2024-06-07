import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { Loading } from '../../../components/utility/Loading';
import { ReminderTask } from './ReminderTask';
import { add } from 'date-fns';
import { ITask, TaskType } from '@repo/shared';

type Props = {
    taskList: ITask[];
};

export function Reminder(props: Props) {
    const typeList = [TaskType.HAPPY_BIRTHDAY.toString()];
    return (
        <>
            {props.taskList
                ?.filter((o) => o.dateFrom.getTime() <= new Date().getTime())
                .filter((o) => typeList.includes(o.type))
                .map((task) => <ReminderTask task={task} />)}
        </>
    );
}
