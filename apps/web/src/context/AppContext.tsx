import { useMediaQuery } from '@mui/material';
import { Dispatch, FC, ReactNode, createContext, useEffect, useState } from 'react';

export type AppContextType = {
    compactView: boolean;
    setCompactView: Dispatch<boolean>;
};

const AppContext = createContext<AppContextType>({
    compactView: false,
    setCompactView: () => {},
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = (props) => {
    const { children } = props;
    const [compactView, setCompactView] = useState(false);
    const wideScreen = useMediaQuery('(min-width:900px)');

    useEffect(() => {
        setCompactView(!wideScreen);
    }, [wideScreen]);

    return (
        <AppContext.Provider value={{ compactView, setCompactView }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
