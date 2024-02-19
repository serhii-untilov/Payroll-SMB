import { Box, Link, Typography } from '@mui/material';
import { useDisabled } from '../../hooks/useDisabled';

export function Copyright(props: any) {
    const isDisabled = useDisabled();
    return (
        <>
            {!isDisabled && (
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
