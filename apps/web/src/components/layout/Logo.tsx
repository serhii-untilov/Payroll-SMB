import { Box } from '@mui/material';
import logoImage from '/payroll.svg';

export function Logo(props: any) {
    return (
        <Box
            component="img"
            sx={{
                height: 48,
                width: 41,
                mx: ['auto'],
                opacity: 0.85,
                '&:hover:not(.Mui-disabled)': {
                    cursor: 'pointer',
                },
                display: 'inline',
            }}
            alt="Application logo."
            src={logoImage}
            {...props}
        />
    );
}
