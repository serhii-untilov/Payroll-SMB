import { Button } from '@/components/layout/Button';
import { useAppContext } from '@/hooks/useAppContext';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { demo } from '@/services/auth.service';
import { Box, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Features } from './details/Features';
import { Footer } from './details/Footer';
import { Header } from './details/Header';
import { ScreenshotList } from './details/ScreenshotList';

const LINEAR_GRADIENT =
    'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)';

function Welcome() {
    const { themeMode } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {}, [themeMode, locale]);

    const onClickDemo = async () => {
        const credentials = await demo();
        await login(credentials);
        navigate('/dashboard');
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    maxWidth: 'hd2',
                    mx: 'auto',
                }}
            >
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
                    <Button
                        onClick={() => {
                            onClickDemo();
                        }}
                        variant="contained"
                        color="primary"
                        sx={{
                            display: { xs: 'block', sm: 'none', md: 'none' },
                            borderRadius: 3,
                            height: 38,
                            width: 90,
                            px: 2,
                            my: 1,
                            textAlign: 'center',
                        }}
                    >
                        {t('Demo')}
                    </Button>
                    <Features />
                    <ScreenshotList />
                    <Footer />
                </Box>
            </Box>
        </>
    );
}

export default Welcome;
