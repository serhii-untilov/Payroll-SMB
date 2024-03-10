import { Button, ButtonProps, styled } from '@mui/material';

export const FormButton = styled(Button)<ButtonProps>(({ theme }) => ({
    // textTransform: 'none',
    color: theme.palette.mode === 'light' ? 'white' : 'black',
    bgcolor: theme.palette.mode === 'light' ? '#1976d222' : '#1976d277',
    // opacity: theme.palette.mode === 'light' ? 0.85 : 1,
    borderRadius: '12px',
    borderShadow: 'none',
}));
