import { Box, CircularProgress } from '@mui/material';

export const TextLoading = () => (
    <div>
        <h1>Loading...</h1>
    </div>
);

export const Loading = () => (
    <Box sx={{ display: 'flex' }}>
        <CircularProgress />
    </Box>
);
