import { Typography } from '@mui/material';

type TaskListTitleProps = {
    title: string;
};

export default function TaskListTitle({ title }: TaskListTitleProps) {
    return (
        <Typography component="h4" variant="h4" textAlign={'center'}>
            {title}
        </Typography>
    );
}
