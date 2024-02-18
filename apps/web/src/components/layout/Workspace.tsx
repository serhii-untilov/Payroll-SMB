import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';

export function Workspace() {
    return (
        <>
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    m: [0],
                }}
            >
                <Paper
                    sx={{
                        height: '100%',
                        width: '100%',
                        m: [0],
                        p: [1],
                    }}
                >
                    <h2>Workspace</h2>
                </Paper>
            </Box>
        </>
    );
}
