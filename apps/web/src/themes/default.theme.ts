import { createTheme, responsiveFontSizes } from '@mui/material';

export function defaultTheme() {
    const theme = createTheme();
    return responsiveFontSizes(theme);
}
