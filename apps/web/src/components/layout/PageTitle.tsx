import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageTitle(props: PropsWithChildren) {
    const { children, ...other } = props;

    return (
        <Box sx={{ height: 48, display: 'flex', alignItems: 'center' }}>
            <Typography component="h2" color="primary.main" variant="h2" noWrap {...other}>
                {children}
            </Typography>
        </Box>
    );
}
