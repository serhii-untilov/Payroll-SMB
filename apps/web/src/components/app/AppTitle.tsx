import { Typography } from '@mui/material';

export function AppTitle(props: any) {
    const title = import.meta.env['VITE_APP_TITLE'] || import.meta.env['TITLE'];
    return (
        <Typography component="h1" variant="h4" color="text.primary" align="center" {...props}>
            {title}
        </Typography>
    );
}
