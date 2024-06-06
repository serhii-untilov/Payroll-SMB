import { ITask } from '@repo/shared';
import { UpcomingTask } from './UpcomingTask';

type Props = {
    taskList: ITask[];
};

export function Upcoming(props: Props) {
    return (
        <>
            {props.taskList
                ?.filter((o) => o.dateFrom.getTime() > new Date().getTime())
                .map((task) => <UpcomingTask task={task} />)}
        </>
    );
}
