import { Typography } from '@mui/material';

const TaskDescription = ({ description }) => {
    return <Typography sx={{ color: 'text.primary' }}>{description}</Typography>;
};

export default TaskDescription;
