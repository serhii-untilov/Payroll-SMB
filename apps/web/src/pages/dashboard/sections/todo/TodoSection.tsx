import { Task } from '@repo/openapi';
import useTodo from '@/hooks/useTodo';
import TodoList from './TodoList';

const TodoSection = (props: { taskList: Task[] }) => {
    const taskList = useTodo(props.taskList);
    return <TodoList taskList={taskList} />;
};

export default TodoSection;
