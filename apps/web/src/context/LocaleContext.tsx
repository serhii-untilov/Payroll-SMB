import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import { Localization, enUS, ukUA } from '@mui/material/locale';

export type Locale = {
    code: string;
    name: string;
    locale: Localization;
};

const supportedLocales: Locale[] = [
    { code: 'en', name: 'English', locale: enUS },
    { code: 'uk', name: 'Українська', locale: ukUA },
];

export type LocaleContextType = {
    locale: Locale;
    setLocale: any;
    supportedLocales: typeof supportedLocales;
};

const LocaleContext = createContext<LocaleContextType>({
    locale: supportedLocales[0],
    setLocale: null,
    supportedLocales: supportedLocales,
});

interface LocaleProviderProps {
    children: ReactNode;
}

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
    const { children } = props;
    const [locale, setLocale] = useState<Locale>(getBrowserLocale() || supportedLocales[0]);

    useEffect(() => {
        function handleLanguageChange() {
            setLocale(getBrowserLocale() || supportedLocales[0]);
        }
        window.addEventListener('languagechange', handleLanguageChange);
        return () => {
            window.removeEventListener('languagechange', handleLanguageChange);
        };
    }, []);

    return (
        <LocaleContext.Provider value={{ locale, setLocale, supportedLocales }}>
            {children}
        </LocaleContext.Provider>
    );
};

function getBrowserLocale(): Locale | undefined {
    const currentLang = navigator.language.replace('-', '');
    return supportedLocales.find((o) => o.code.startsWith(currentLang));
}

export default LocaleContext;
