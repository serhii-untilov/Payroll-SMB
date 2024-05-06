import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageTitle(props: PropsWithChildren) {
    const { children } = props;

    return (
        <Box sx={{ height: 48, marginTop: 0.5 }}>
            <Typography
                component="h2"
                // color="text.primary"
                color="primary.main"
                variant="h2"
                noWrap
                // align="center"
                {...props}
            >
                {children}
            </Typography>
        </Box>
    );
}
