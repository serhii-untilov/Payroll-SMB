import { Dispatch, FC, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { Localization, enUS, ukUA } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

export type supportedLanguages = 'en' | 'uk';

export type Locale = {
    language: supportedLanguages;
    name: string;
    locale: Localization;
};

const supportedLocales: Locale[] = [
    { language: 'en', name: 'English', locale: enUS },
    { language: 'uk', name: 'Українська', locale: ukUA },
];

export type LocaleContextType = {
    locale: Locale;
    setLocale: Dispatch<SetStateAction<Locale>>;
    setLanguage: Dispatch<string>;
    supportedLocales: typeof supportedLocales;
};

const LocaleContext = createContext<LocaleContextType>({
    locale: supportedLocales[0],
    setLocale: () => {},
    setLanguage: () => {},
    supportedLocales: supportedLocales,
});

interface LocaleProviderProps {
    children: ReactNode;
}

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
    const { children } = props;
    const { user } = useAuth();
    const userLocale = supportedLocales.find((o) => o.language === user?.language);
    const [locale, setLocale] = useState<Locale>(getBrowserLocale() || supportedLocales[0]);
    // i18n
    const {
        i18n: { changeLanguage },
    } = useTranslation();

    useEffect(() => {
        if (user?.language) {
            const locale = supportedLocales.find((o) => o.language === user?.language);
            if (locale) {
                setLocale(locale);
                changeLanguage(locale.language);
            }
        }
    }, [user, changeLanguage]);

    useEffect(() => {
        function handleLanguageChange() {
            const locale = getBrowserLocale() || supportedLocales[0];
            setLocale(locale);
            changeLanguage(locale.language);
        }
        window.addEventListener('languagechange', handleLanguageChange);
        return () => {
            window.removeEventListener('languagechange', handleLanguageChange);
        };
    }, [changeLanguage]);

    function setLanguage(language: string): void {
        const locale = supportedLocales.find((o) => o.language.startsWith(language));
        if (locale) {
            setLocale(locale);
            changeLanguage(locale.language);
        }
    }

    return (
        <LocaleContext.Provider value={{ locale, setLocale, setLanguage, supportedLocales }}>
            {children}
        </LocaleContext.Provider>
    );
};

function getBrowserLocale(): Locale | undefined {
    const currentLang = navigator.language.replace('-', '');
    return supportedLocales.find((o) => o.language.startsWith(currentLang));
}

export default LocaleContext;