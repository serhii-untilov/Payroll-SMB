import { ButtonProps, Button as MuiButton, styled } from '@mui/material';

export const StyledButton = styled(MuiButton)<ButtonProps>(() => ({
    borderRadius: '3px',
}));

export function Button(props: ButtonProps) {
    return <StyledButton variant="contained" color="primary" {...props} />;
}
