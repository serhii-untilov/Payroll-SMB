import { CircularProgress, CircularProgressProps, Grid } from '@mui/material';

export const Loading = (props: CircularProgressProps) => (
    <Grid container flexDirection="column" justifyContent="center" height={'100%'}>
        <Grid item container justifyContent="center">
            <CircularProgress color="primary" {...props} />
        </Grid>
    </Grid>
);
