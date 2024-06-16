import {
    ThemeOptions,
    ThemeProvider,
    createTheme,
    responsiveFontSizes,
    useMediaQuery,
} from '@mui/material';
import { ICompany, IUserCompany, ServerEvent, monthBegin } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth } from 'date-fns';
import { Dispatch, FC, ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import { getCompany } from '../services/company.service';
import { getCurrentPayPeriodDateFrom } from '../services/payPeriod.service';
import { getUserCompanyList } from '../services/user.service';
import { defaultTheme } from '../themes/defaultTheme';

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
    serverEvent: string;
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
    payPeriod: monthBegin(new Date()),
    setPayPeriod: () => {},
    serverEvent: '',
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
    const [serverEvent, setServerEvent] = useState('');
    const queryClient = useQueryClient();

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
                localStorage.setItem('company', currentCompany.id.toString());
            }
        };
        initCompany();
    }, [userCompanyList]);

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        if (company) {
            localStorage.setItem('company', company.id.toString());
        }
    }, [company]);

    useEffect(() => {
        const initPayPeriod = async () => {
            const current: Date =
                (await getCurrentPayPeriodDateFrom(company?.id)) || monthBegin(new Date());
            const lastCurrent: Date = monthBegin(
                localStorage.getItem('currentPayPeriod') || new Date(),
            );
            if (current.getTime() !== lastCurrent.getTime()) {
                localStorage.setItem('currentPayPeriod', format(current, 'yyyy-MM-dd'));
                localStorage.setItem('payPeriod', format(current, 'yyyy-MM-dd'));
                setPayPeriod(current);
                return;
            }
            const payPeriod: Date = monthBegin(localStorage.getItem('payPeriod') || new Date());
            localStorage.setItem('currentPayPeriod', format(current, 'yyyy-MM-dd'));
            localStorage.setItem('payPeriod', format(payPeriod, 'yyyy-MM-dd'));
            setPayPeriod(payPeriod);
        };
        initPayPeriod();
    }, [company]);

    const eventSource = useMemo(() => {
        return company?.id
            ? new EventSource(`/api/server-events/company-stream/${company?.id}`)
            : null;
    }, [company]);

    useEffect(() => {
        if (eventSource) {
            eventSource.onerror = function (event) {
                // setServerEvent(ServerEvent.COMMUNICATION_ERROR);
                // console.log(`An error occurred while attempting to connect.`);
                console.log(
                    `SSE error: ${ServerEvent.COMMUNICATION_ERROR}, event: ${JSON.stringify(event)}`,
                );
            };
            eventSource.onmessage = async (event) => {
                if (event.data.includes('finished')) {
                    ['company', 'department', 'payPeriod', 'position', 'person', 'task'].forEach(
                        async (key) => {
                            await queryClient.invalidateQueries({
                                queryKey: [key],
                                refetchType: 'all',
                            });
                        },
                    );
                }
                setServerEvent(event.data);
                console.log(`New company ${company?.id} message:`, event.data);
            };
        }
    }, [eventSource, company, queryClient]);

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
                serverEvent,
            }}
        >
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppContext.Provider>
    );
};

export default AppContext;
