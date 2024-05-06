import { Box, Paper, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageSubTitle({ children, ...other }: PropsWithChildren) {
    return (
        <Box sx={{ height: 48 }}>
            <Typography
                component="h3"
                color="primary.main"
                variant="h3"
                noWrap
                // align="center"
                mb={{ xs: 1, sm: 2 }}
                {...other}
            >
                {children}
            </Typography>
        </Box>
    );
}
