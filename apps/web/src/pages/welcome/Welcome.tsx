import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import { Box, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import DemoButton from './details/DemoButton';
import { Features } from './details/Features';
import { Footer } from './details/Footer';
import { Header } from './details/Header';
import { ScreenshotList } from './details/ScreenshotList';

const LINEAR_GRADIENT =
    'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)';

export default function Welcome() {
    const { themeMode } = useAppContext();
    const { locale } = useLocale();

    useEffect(() => {}, [themeMode, locale]);

    return (
        <>
            <Box sx={{ display: 'flex', maxWidth: 'hd2', mx: 'auto' }}>
                <CssBaseline />
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
                        background: (theme) =>
                            theme.palette.mode === 'light' ? LINEAR_GRADIENT : '',
                    }}
                >
                    <Header />
                    <DemoButton />
                    <Features />
                    <ScreenshotList />
                    <Footer />
                </Box>
            </Box>
        </>
    );
}
