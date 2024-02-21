import { Box, CircularProgress } from '@mui/material';

export const Loading = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mx: ['auto'] }}>
        <CircularProgress color="inherit" />
    </Box>
);
