import {
    ThemeOptions,
    ThemeProvider,
    createTheme,
    responsiveFontSizes,
    useMediaQuery,
} from '@mui/material';
import { ICompany, IPayPeriod, IUserCompany } from '@repo/shared';
import { Dispatch, FC, ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import { defaultTheme } from '../themes/defaultTheme';
import { getUserCompanyList } from '../services/user.service';
import {
    getCurrentPayPeriod,
    getCurrentPayPeriodDateFrom,
    getPayPeriod,
} from '../services/payPeriod.service';
import { useQuery } from 'react-query';
import { format, startOfMonth } from 'date-fns';
import { getCompany } from '../services/company.service';

export type AppContextType = {
    compactView: boolean;
    setCompactView: Dispatch<boolean>;
    company: ICompany | null | undefined;
    setCompany: Dispatch<ICompany | null>;
    theme: ThemeOptions;
    themeMode: string;
    setThemeMode: Dispatch<string>;
    switchThemeMode: () => void;
    payPeriod: Date | undefined | null;
    setPayPeriod: Dispatch<Date | undefined | null>;
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
    payPeriod: startOfMonth(new Date()),
    setPayPeriod: () => {},
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = (props) => {
    const { children } = props;
    const [compactView, setCompactView] = useState(false);
    const wideScreen = useMediaQuery('(min-width:900px)');
    const [userCompanyList, setUserCompanyList] = useState<IUserCompany[]>([]);
    const [company, setCompany] = useState<ICompany | null | undefined>(null);
    const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');
    const { user } = useAuth();
    const { locale } = useLocale();
    const theme = useMemo(
        () => responsiveFontSizes(createTheme(defaultTheme(themeMode), locale.locale)),
        [themeMode, locale],
    );
    const [payPeriod, setPayPeriod] = useState<Date | undefined | null>(null);

    useEffect(() => {
        setCompactView(!wideScreen);
    }, [wideScreen]);

    useEffect(() => {
        const initCompanyList = async () => {
            const userCompanyList = user?.id ? await getUserCompanyList(user?.id, true) : [];
            setUserCompanyList(userCompanyList);
        };
        initCompanyList();
    }, [user]);

    useEffect(() => {
        const initCompany = async () => {
            const companyId = +(localStorage.getItem('company') || 0);
            if (userCompanyList.length) {
                const userCompany =
                    userCompanyList.find((o) => o.companyId === companyId) || userCompanyList[0];
                const currentCompany = await getCompany(userCompany.companyId);
                setCompany(currentCompany);
                // setPayPeriod(company?.payPeriod || startOfMonth(new Date()));
                localStorage.setItem('company', currentCompany.id.toString());
            }
        };
        initCompany();
    }, [userCompanyList]);

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        const initPayPeriod = async () => {
            const current: Date = startOfMonth(
                (await getCurrentPayPeriodDateFrom(company?.id)) || new Date(),
            );
            const lastCurrent: Date = startOfMonth(
                localStorage.getItem('currentPayPeriod') || new Date(),
            );
            if (current.getTime() !== lastCurrent.getTime()) {
                localStorage.setItem('currentPayPeriod', format(current, 'yyyy-MM-dd'));
                localStorage.setItem('payPeriod', format(current, 'yyyy-MM-dd'));
                setPayPeriod(current);
                return;
            }
            const payPeriod: Date = startOfMonth(localStorage.getItem('payPeriod') || new Date());
            localStorage.setItem('currentPayPeriod', format(current, 'yyyy-MM-dd'));
            localStorage.setItem('payPeriod', format(payPeriod, 'yyyy-MM-dd'));
            setPayPeriod(payPeriod);
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
