import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function PageTitle(props: PropsWithChildren) {
    const { children } = props;

    return (
        <Typography
            component="h2"
            color="text.primary"
            variant="h2"
            noWrap
            // align="center"
            {...props}
        >
            {children}
        </Typography>
    );
}
