import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageSubTitle({ children, ...other }: PropsWithChildren) {
    return (
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
    );
}
