import { useMediaQuery } from '@mui/material';
import { ICompany } from '@repo/shared';
import { Dispatch, FC, ReactNode, createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

export type AppContextType = {
    compactView: boolean;
    setCompactView: Dispatch<boolean>;
    company: ICompany | undefined;
    setCompany: Dispatch<ICompany>;
};

const AppContext = createContext<AppContextType>({
    compactView: false,
    setCompactView: () => {},
    company: undefined,
    setCompany: () => {},
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = (props) => {
    const { children } = props;
    const [compactView, setCompactView] = useState(false);
    const wideScreen = useMediaQuery('(min-width:900px)');
    const [company, setCompany] = useState<ICompany>();
    const { user } = useAuth();

    useEffect(() => {
        setCompactView(!wideScreen);
    }, [wideScreen]);

    useEffect(() => {
        const initCompany = () => {
            const companyId = +(localStorage.getItem('company') || 0);
            setCompany(user?.companies?.find((o) => o.id === companyId) || user?.companies?.[0]);
        };
        initCompany();
    }, [user]);

    return (
        <AppContext.Provider value={{ compactView, setCompactView, company, setCompany }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
