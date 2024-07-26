import { Task } from '@repo/openapi';
import useTodo from '../../hooks/useTodo';
import { TodoList } from './TodoList';

type Props = {
    taskList: Task[];
};

export default function Todo(props: Props) {
    const taskList = useTodo(props.taskList);
    return <TodoList taskList={taskList} />;
}
