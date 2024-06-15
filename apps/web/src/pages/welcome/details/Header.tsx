import { Language, MenuRounded } from '@mui/icons-material';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppTitle } from '../../../components/layout/AppTitle';
import { Button } from '../../../components/layout/Button';
import { Logo } from '../../../components/layout/Logo';
import useAppContext from '../../../hooks/useAppContext';
import useAuth from '../../../hooks/useAuth';
import useLocale from '../../../hooks/useLocale';
import { logoutUser, preview } from '../../../services/auth.service';
import { SidebarMenu } from './SidebarMenu';

export function Header() {
    const { themeMode } = useAppContext();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);
    const { toggleLanguage } = useLocale();
    const { login, logout } = useAuth();

    const onToggleLanguage = () => {
        toggleLanguage();
    };

    const letsGo = () => {
        navigate('/dashboard');
    };

    const onClickDemo = async () => {
        const credentials = await preview();
        await login(credentials);
        navigate('/dashboard');
    };

    const onClickRegister = async () => {
        await logout();
        navigate('/signup');
    };

    const onClickLogin = async () => {
        await logout();
        navigate('/signin');
    };

    return (
        <>
            <Box
                id="header"
                sx={{
                    maxWidth: 'lg',
                    width: '100%',
                    px: { xs: 1, sm: 2 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    // fixed header
                    // zIndex: 100,
                    // position: 'fixed',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 'lg',
                        width: '100%',
                        my: 2,
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: 25,
                        /* From https://css.glass */
                        background: themeMode === 'light' ? 'rgba(255, 255, 255, 0.6)' : '',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        webkitBackdropFilter: 'blur(5px)',
                        // border: '1px solid rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(25, 118, 210, 0.3)',
                    }}
                >
                    <Box id="header__left-side" sx={{ display: 'flex', align: 'center', px: 1 }}>
                        <Logo disabled={true} onClick={letsGo} />
                        {/* {wideScreen && ( */}
                        <AppTitle
                            onClick={letsGo}
                            align="left"
                            sx={{
                                color: 'primary.main',
                                display: 'inline',
                                my: 'auto',
                                mx: 2,
                                cursor: 'pointer',
                            }}
                        />
                        {/* )} */}
                    </Box>
                    <Box
                        id="header__right-side"
                        sx={{ display: 'flex', align: 'center', px: 2, gap: 1 }}
                    >
                        <Button
                            onClick={() => {
                                onClickDemo();
                            }}
                            variant="contained"
                            color="primary"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
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

                        <Button
                            onClick={() => onClickRegister()}
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
                                borderRadius: 3,
                                width: 120,
                                height: 38,
                                px: 2,
                                my: 'auto',
                                textAlign: 'center',
                            }}
                        >
                            {t('Sign Up')}
                        </Button>

                        <Button
                            onClick={() => onClickLogin()}
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                width: 90,
                                px: 2,
                                my: 'auto',
                                textAlign: 'center',
                            }}
                        >
                            {t('Sign In')}
                        </Button>

                        <IconButton
                            id="header__menu-button"
                            onClick={() => {
                                setShowSidebarMenu(true);
                            }}
                            sx={{
                                my: 'auto',
                                color: 'primary.main',
                                display: { xs: 'inline-flex', sm: 'inline-flex', md: 'none' },
                            }}
                        >
                            <MenuRounded />
                        </IconButton>
                        <IconButton
                            color="primary"
                            sx={{
                                my: 'auto',
                                display: { xs: 'none', sm: 'none', md: 'inline-flex' },
                            }}
                            onClick={() => {
                                onToggleLanguage();
                            }}
                        >
                            <Language />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Drawer
                anchor={'top'}
                open={showSidebarMenu}
                onClose={() => {
                    setShowSidebarMenu(false);
                }}
            >
                {
                    <SidebarMenu
                        onClickDemo={onClickDemo}
                        onClickLogin={onClickLogin}
                        onClickRegister={onClickRegister}
                        setShowSidebarMenu={setShowSidebarMenu}
                    />
                }
            </Drawer>
        </>
    );
}
