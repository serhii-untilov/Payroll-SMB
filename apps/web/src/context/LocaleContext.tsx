import { useAuth } from '@/hooks/context/useAuth';
import { enUS } from '@mui/material/locale';
import { ukUA } from '@mui/x-data-grid/locales';
import { enUS as dateEn } from 'date-fns/locale/en-US';
import { uk as dateUk } from 'date-fns/locale/uk';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type supportedLanguages = 'en' | 'uk';

export type Locale = {
    language: supportedLanguages;
    name: string;
    locale: any;
    dateLocale: any;
};

const supportedLocales: Locale[] = [
    { language: 'en', name: 'English', locale: enUS, dateLocale: dateEn },
    { language: 'uk', name: 'Українська', locale: ukUA, dateLocale: dateUk },
];

export type LocaleContextType = {
    locale: Locale;
    setLocale: Dispatch<SetStateAction<Locale>>;
    setLanguage: (language?: string | null) => void;
    toggleLanguage: () => void;
    supportedLocales: typeof supportedLocales;
};

const LocaleContext = createContext<LocaleContextType>({
    locale: supportedLocales[0],
    setLocale: () => {},
    setLanguage: () => {},
    toggleLanguage: () => {},
    supportedLocales: supportedLocales,
});

interface LocaleProviderProps {
    children: ReactNode;
}

export const LocaleProvider: FC<LocaleProviderProps> = (props) => {
    const { children } = props;
    const { user } = useAuth();
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

    function setLanguage(language: string | null): void {
        const locale = getLocale(language);
        if (locale) {
            setLocale(locale);
            changeLanguage(locale.language);
        }
    }

    function toggleLanguage(): void {
        // Set next locale
        const index = supportedLocales.findIndex((o) => o.language === locale.language);
        if (index < 0 || index === supportedLocales.length - 1) {
            setLocale(supportedLocales[0]);
            changeLanguage(supportedLocales[0].language);
        } else {
            setLocale(supportedLocales[index + 1]);
            changeLanguage(supportedLocales[index + 1].language);
        }
    }

    return (
        <LocaleContext.Provider
            value={{ locale, setLocale, setLanguage, toggleLanguage, supportedLocales }}
        >
            {children}
        </LocaleContext.Provider>
    );
};

function getLocale(language: string | null) {
    if (!language) return getBrowserLocale();
    return supportedLocales.find((o) => o.language.startsWith(language)) || getBrowserLocale();
}

function getBrowserLocale(): Locale | undefined {
    const currentLang = navigator.language.replace('-', '');
    return supportedLocales.find((o) => o.language.startsWith(currentLang));
}

export default LocaleContext;
