import { createTheme, responsiveFontSizes } from '@mui/material';

export function defaultTheme() {
    const theme = createTheme({
        components: {
            MuiButtonBase: {
                defaultProps: {
                    // disableRipple: true,
                    disableTouchRipple: true,
                },
            },
        },
        // transitions: {
        //     // So we have `transition: none;` everywhere
        //     create: () => 'none',
        // },
        palette: {
            secondary: {
                light: '#ffa733',
                main: '#ff9100',
                dark: '#b26500',
            },
        },
        typography: {
            h1: {
                fontSize: '1.2rem',
                fontWeight: 400,
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 400,
            },
            h3: {
                fontSize: '1.8rem',
            },
            h4: {
                fontSize: '1.6rem',
            },
            h5: {
                fontSize: '1.4rem',
            },
            h6: {
                fontSize: '1.2rem',
            },
        },
    });
    return responsiveFontSizes(theme);
}
