import { Theme, createTheme } from '@mui/material';
import { FC, ReactNode, createContext, useMemo, useState } from 'react';
import * as locales from '@mui/material/locale';
import { ThemeProvider, useTheme } from '@emotion/react';

export type LocaleContextType = {
    locale: string | null;
    setLocale: any;
    theme: Theme | null;
};

const LocaleContext = createContext<LocaleContextType>({
    locale: null,
    setLocale: null,
    theme: null,
});

interface LocaleProviderProps {
    children: ReactNode;
}

type SupportedLocales = keyof typeof locales;

const navigatorLanguage = (): any => {
    const currentLang = navigator.language.replace('-', '');
    return currentLang ? Object.keys(locales).find((o) => o.startsWith(currentLang)) : null;
};

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
    const { children } = props;
    const [locale, setLocale] = useState<SupportedLocales>(navigatorLanguage() || 'enUS');
    const currentTheme = useTheme();
    const theme = useMemo(() => createTheme(currentTheme, locales[locale]), [locale, currentTheme]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale, theme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </LocaleContext.Provider>
    );
};

export default LocaleContext;
