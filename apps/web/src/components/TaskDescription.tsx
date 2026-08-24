import { Typography } from '@mui/material';

const TaskDescription = ({ description }: { description: string }) => {
    return <Typography sx={{ color: 'text.primary' }}>{description}</Typography>;
};

export default TaskDescription;
