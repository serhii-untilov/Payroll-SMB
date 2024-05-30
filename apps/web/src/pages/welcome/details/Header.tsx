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
        navigate('/');
    };

    return (
        <>
            <Box
                id="header"
                sx={{
                    maxWidth: 'lg',
                    width: '100%',
                    px: { xs: 0, sm: 1, md: 2 },
                    display: 'flex',
                    justifyContent: 'space-between',
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
                        border: '1px solid rgba(255, 255, 255, 0.3)',
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
                        sx={{ display: 'flex', align: 'center', px: 2, gap: 0 }}
                    >
                        <Button
                            href="/demo"
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
                            }}
                        >
                            {t('Demo')}
                        </Button>
                        <IconButton
                            href="/demo"
                            sx={{
                                color: 'primary.main',
                                display: { xs: 'none', sm: 'block', md: 'none' },
                            }}
                        >
                            <SearchRounded />
                        </IconButton>

                        <Button
                            href="/login"
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
                            }}
                        >
                            {t('Sign In')}
                        </Button>

                        <IconButton
                            href="/login"
                            sx={{
                                color: 'primary.main',
                                display: { xs: 'none', sm: 'block', md: 'none' },
                            }}
                        >
                            <LoginRounded />
                        </IconButton>

                        <Button
                            href="/register"
                            variant="text"
                            sx={{
                                display: { xs: 'none', sm: 'none', md: 'block' },
                                borderRadius: 3,
                                height: 38,
                                px: 2,
                                my: 'auto',
                            }}
                        >
                            {t('Sign Up')}
                        </Button>
                        <IconButton
                            href="/register"
                            sx={{
                                color: 'primary.main',
                                display: { xs: 'none', sm: 'block', md: 'none' },
                            }}
                        >
                            <PersonRounded />
                        </IconButton>

                        <IconButton
                            id="header__menu-button"
                            onClick={() => {
                                setShowSidebarMenu(true);
                            }}
                            sx={{
                                color: 'primary.main',
                                display: { xs: 'block', sm: 'none' },
                            }}
                        >
                            <MenuRounded />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            {/* {showSidebarMenu && <SidebarMenu setShowSidebarMenu={setShowSidebarMenu} />} */}
            <Drawer
                anchor={'right'}
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
