import { Button, ButtonProps, styled } from '@mui/material';

export const FormButton = styled(Button)<ButtonProps>(({ theme }) => ({
    textTransform: 'none',
}));
