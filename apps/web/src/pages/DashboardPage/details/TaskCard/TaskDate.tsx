import { Grid, Typography } from '@mui/material';

type TaskDateProps = {
    date: string;
};

const TaskDate = ({ date }: TaskDateProps) => {
    return (
        <Grid
            alignItems={'middle'}
            alignContent={'center'}
            width={48}
            item
            sx={{
                mr: 1,
                px: 1,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : 'white'),
                borderRadius: 2,
            }}
        >
            <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                {date.split(' ')[0]}
            </Typography>
            <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                {date.split(' ')[1].replace('.', '')}
            </Typography>
        </Grid>
    );
};

export default TaskDate;
