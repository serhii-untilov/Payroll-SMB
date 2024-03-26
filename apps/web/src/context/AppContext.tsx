import {
    ThemeOptions,
    ThemeProvider,
    createTheme,
    responsiveFontSizes,
    useMediaQuery,
} from '@mui/material';
import { ICompany, IPayPeriod } from '@repo/shared';
import { Dispatch, FC, ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import { defaultTheme } from '../themes/defaultTheme';
import { getUserCompanyList } from '../services/user.service';
import { getCurrentPayPeriod, getPayPeriod } from '../services/payPeriod.service';
import { useQuery } from 'react-query';

export type AppContextType = {
    compactView: boolean;
    setCompactView: Dispatch<boolean>;
    company: ICompany | null | undefined;
    setCompany: Dispatch<ICompany | null>;
    theme: ThemeOptions;
    themeMode: string;
    setThemeMode: Dispatch<string>;
    switchThemeMode: () => void;
    payPeriod: IPayPeriod | undefined | null;
    setPayPeriod: Dispatch<IPayPeriod | undefined | null>;
};

const AppContext = createContext<AppContextType>({
    compactView: false,
    setCompactView: () => {},
    company: undefined,
    setCompany: () => {},
    theme: {},
    themeMode: 'light',
    setThemeMode: () => {},
    switchThemeMode: () => {},
    payPeriod: undefined,
    setPayPeriod: () => {},
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = (props) => {
    const { children } = props;
    const [compactView, setCompactView] = useState(false);
    const wideScreen = useMediaQuery('(min-width:900px)');
    const [companyList, setCompanyList] = useState<ICompany[]>([]);
    const [company, setCompany] = useState<ICompany | null | undefined>(null);
    const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');
    const { user } = useAuth();
    const { locale } = useLocale();
    const theme = useMemo(
        () => responsiveFontSizes(createTheme(defaultTheme(themeMode), locale.locale)),
        [themeMode, locale],
    );
    const [payPeriod, setPayPeriod] = useState<IPayPeriod | undefined | null>(null);

    useEffect(() => {
        setCompactView(!wideScreen);
    }, [wideScreen]);

    useEffect(() => {
        const initCompanyList = async () => {
            const userCompanyList = user?.id ? await getUserCompanyList(user?.id) : [];
            setCompanyList(userCompanyList);
        };
        initCompanyList();
    }, [user]);

    useEffect(() => {
        const initCompany = () => {
            const companyId = +(localStorage.getItem('company') || 0);
            if (companyList.length) {
                setCompany(companyList.find((o) => o.id === companyId) || companyList[0]);
            }
        };
        initCompany();
    }, [companyList]);

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        const initPayPeriod = async () => {
            const current = company ? await getCurrentPayPeriod(company.id) : null;
            if (!current) {
                setPayPeriod(null);
                return;
            }
            const currentId = parseInt(localStorage.getItem('currentPayPeriodId') || '0');
            if (current.id !== currentId) {
                localStorage.setItem('currentPayPeriodId', current.id.toString());
                localStorage.setItem('payPeriodId', current.id.toString());
                setPayPeriod(current);
                return;
            }
            const id = localStorage.getItem('payPeriodId');
            const payPeriod = id ? await getPayPeriod(company?.id || 0, +id) : null;
            localStorage.setItem('payPeriodId', (payPeriod?.id || current?.id || 0).toString());
            return payPeriod || current;
        };
        initPayPeriod();
    }, [company]);

    const switchThemeMode = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    return (
        <AppContext.Provider
            value={{
                compactView,
                setCompactView,
                company,
                setCompany,
                theme,
                themeMode,
                setThemeMode,
                switchThemeMode,
                payPeriod,
                setPayPeriod,
            }}
        >
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppContext.Provider>
    );
};

export default AppContext;
