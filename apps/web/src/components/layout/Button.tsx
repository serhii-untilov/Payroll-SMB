import { Button as MuiButton, ButtonProps, styled, createTheme } from '@mui/material';

export const StyledButton = styled(MuiButton)<ButtonProps>(({ theme }) => ({
    // textTransform: 'none',
    // color: theme.palette.mode === 'light' ? 'white' : 'black',
    // bgcolor: theme.palette.mode === 'light' ? '#1976d222' : '#1976d277',
    // opacity: theme.palette.mode === 'light' ? 0.85 : 1,
    borderRadius: '3px',
    // borderShadow: 'none',
}));

export function Button(props: ButtonProps) {
    return <StyledButton variant="contained" color="primary" {...props} />;
}
