import { FC, ReactNode, createContext, useState } from 'react';
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

    return (
        <LocaleContext.Provider value={{ locale, setLocale, supportedLocales }}>
            {children}
        </LocaleContext.Provider>
    );
};

function getBrowserLocale(): Locale | undefined {
    const currentLang = navigator.language.replace('-', '');
    return supportedLocales.find((o) => o.name.startsWith(currentLang));
}

export default LocaleContext;
