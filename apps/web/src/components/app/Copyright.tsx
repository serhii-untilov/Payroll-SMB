import { Box, Link, Typography } from '@mui/material';

export function Copyright(props: any) {
    const isVisible = false;
    return (
        <>
            {isVisible && (
                <Box>
                    <Typography variant="body2" color="text.secondary" align="center" {...props}>
                        {'Copyright ©'}
                        <Link color="inherit" href="https://untilov.com.ua/">
                            {' Untilov.com.ua '}
                        </Link>
                        {new Date().getFullYear()}
                    </Typography>
                </Box>
            )}
        </>
    );
}
