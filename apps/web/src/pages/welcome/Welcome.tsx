import { Box, CssBaseline } from '@mui/material';
import useAppContext from '../../hooks/useAppContext';
import { Features } from './details/Features';
import { Footer } from './details/Footer';
import { Header } from './details/Header';
import { ScreenshotList } from './details/ScreenshotList';
import { useEffect } from 'react';
import useLocale from '../../hooks/useLocale';
import { Button } from '../../components/layout/Button';
import { useTranslation } from 'react-i18next';
import { preview } from '../../services/auth.service';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const { themeMode } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {}, [themeMode, locale]);

    const onClickDemo = async () => {
        const credentials = await preview();
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
                            theme.palette.mode === 'light'
                                ? 'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)'
                                : '',
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
                            my: 'auto',
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
