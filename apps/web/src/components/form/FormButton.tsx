import { Button, ButtonProps, styled } from '@mui/material';

export const FormButton = styled(Button)<ButtonProps>(({ theme }) => ({
    textTransform: 'none',
    color: theme.palette.mode === 'light' ? 'white' : 'black',
    bgcolor:
        theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    opacity: theme.palette.mode === 'light' ? 0.85 : 1,
}));
