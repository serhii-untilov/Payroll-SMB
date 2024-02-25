import { Box } from '@mui/material';

export function Logo(props: any) {
    return (
        <Box
            component="img"
            sx={{
                height: 48,
                width: 41,
                mx: ['auto'],
                opacity: 0.65,
                '&:hover:not(.Mui-disabled)': {
                    cursor: 'pointer',
                },
            }}
            alt="Application logo."
            src="payroll-black.png"
            {...props}
        />
    );
}
