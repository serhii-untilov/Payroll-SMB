import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageSubTitle({ children, ...other }: PropsWithChildren) {
    return (
        <Box>
            <Typography
                component="h3"
                color="primary.main"
                variant="h4"
                noWrap
                mb={{ xs: 1, sm: 2 }}
                {...other}
            >
                {children}
            </Typography>
        </Box>
    );
}
