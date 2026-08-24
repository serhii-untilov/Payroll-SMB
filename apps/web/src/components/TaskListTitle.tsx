import { Typography } from '@mui/material';

const TaskListTitle = ({ title }: { title: string }) => {
    return (
        <Typography component="h4" variant="h4" textAlign={'center'}>
            {title}
        </Typography>
    );
};

export default TaskListTitle;
