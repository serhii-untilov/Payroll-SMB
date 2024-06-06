import { ITask } from '@repo/shared';
import { TodoTask } from './TodoTask';

type Props = {
    taskList: ITask[];
};

export function Todo(props: Props) {
    return (
        <>
            {props.taskList
                ?.filter((o) => o.dateFrom.getTime() <= new Date().getTime())
                .map((task) => <TodoTask task={task} />)}
        </>
    );
}
