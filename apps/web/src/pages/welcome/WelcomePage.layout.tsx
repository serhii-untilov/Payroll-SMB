import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import { Box } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';

const LINEAR_GRADIENT =
    'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)';

export default function WelcomePageLayout(props: PropsWithChildren) {
    const { themeMode } = useAppContext();
    const { locale } = useLocale();

    useEffect(() => {}, [themeMode, locale]);

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
                flex: 1,
                width: '100%',
                overflow: 'auto',
                p: [1],
                background: (theme) => (theme.palette.mode === 'light' ? LINEAR_GRADIENT : ''),
            }}
        >
            {props.children}
        </Box>
    );
}
