import { Box } from '@mui/material';
import logoImage from '/payroll.svg';

export function Logo(props: any) {
    console.log();
    return (
        <Box
            component="img"
            sx={{
                height: 48,
                width: 41,
                mx: ['auto'],
                opacity: 0.55,
                '&:hover:not(.Mui-disabled)': {
                    cursor: 'pointer',
                },
            }}
            alt="Application logo."
            src={logoImage}
            {...props}
        />
    );
}
