import { paletteDark } from './paletteDark';
import { paletteLight } from './paletteLight';

export function defaultTheme(themeMode?: string) {
    return {
        palette: themeMode === 'dark' ? paletteDark() : paletteLight(),
        components: {
            MuiButtonBase: {
                defaultProps: {
                    // disableRipple: true,
                    // disableTouchRipple: true,
                },
            },
        },
        typography: {
            h1: {
                fontSize: '1.4rem',
                fontWeight: 500,
            },
            h2: {
                fontSize: '1.2rem',
                fontWeight: 500,
            },
            h3: {
                fontSize: '1.2rem',
                fontWeight: 500,
            },
            h4: {
                fontSize: '1.15rem',
            },
            h5: {
                fontSize: '1.1rem',
            },
            h6: {
                fontSize: '1.1rem',
            },
        },
    };
}
