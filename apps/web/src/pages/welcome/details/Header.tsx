import { LoginRounded, MenuRounded, PersonRounded, SearchRounded } from '@mui/icons-material';
import { Box, Drawer, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppTitle } from '../../../components/layout/AppTitle';
import { Button } from '../../../components/layout/Button';
import { Logo } from '../../../components/layout/Logo';
import { useState } from 'react';
import { SidebarMenu } from './SidebarMenu';

type Props = { wideScreen: boolean };

export function Header({ wideScreen }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showSidebarMenu, setShowSidebarMenu] = useState(false);

    const letsGo = () => {
        navigate('/dashboard');
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
                        background: 'rgba(255, 255, 255, 0.6)',
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
                                color: 'primary.dark',
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
                            href="/demo"
                            variant="contained"
                            color="primary"
                            sx={{
                                display: { xs: 'none', sm: 'block', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
                            }}
                        >
                            {t('Demo')}
                        </Button>

                        <Button
                            href="/register"
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'block', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
                            }}
                        >
                            {t('Sign Up')}
                        </Button>

                        <Button
                            href="/login"
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'block', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
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
                                color: 'primary.main',
                                display: { xs: 'block', sm: 'none', md: 'none' },
                            }}
                        >
                            <MenuRounded />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            {/* {showSidebarMenu && <SidebarMenu setShowSidebarMenu={setShowSidebarMenu} />} */}
            <Drawer
                anchor={'top'}
                open={showSidebarMenu}
                onClose={() => {
                    setShowSidebarMenu(false);
                }}
            >
                {<SidebarMenu setShowSidebarMenu={setShowSidebarMenu} />}
            </Drawer>
        </>
    );
}
