import { Box, Paper, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageSubTitle({ children, ...other }: PropsWithChildren) {
    return (
        <Box>
            <Typography
                component="h3"
                color="primary.main"
                variant="h4"
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
