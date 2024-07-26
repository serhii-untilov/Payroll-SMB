import { Box } from '@mui/system';
import { Task } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import { Task as TaskComponent } from './Task';
import TaskListTitle from './TaskListTitle';

type Props = {
    taskList: Task[];
};

export default function Todo(props: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Box>
                <TaskListTitle title={t('Things to do')} />
                {props.taskList.map((task) => (
                    <TaskComponent key={task.id} task={task} view="todo" />
                ))}
            </Box>
        </>
    );
}
