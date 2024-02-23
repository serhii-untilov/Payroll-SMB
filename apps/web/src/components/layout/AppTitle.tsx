import { Typography, TypographyProps } from '@mui/material';

export function AppTitle(props: TypographyProps) {
    const title = import.meta.env['VITE_APP_TITLE'] || import.meta.env['TITLE'];

    return (
        <>
            <Typography
                component="h1"
                variant="h1"
                noWrap
                color="primary.dark"
                align="center"
                sx={{ mb: 2 }}
                {...props}
            >
                {title}
            </Typography>
        </>
    );
}
