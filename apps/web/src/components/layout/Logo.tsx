import { Box } from '@mui/material';
import { MouseEventHandler } from 'react';

export function Logo(props: any) {
    return (
        <Box
            component="img"
            sx={{
                height: 48,
                width: 48,
                mx: ['auto'],
                opacity: 0.85,
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
