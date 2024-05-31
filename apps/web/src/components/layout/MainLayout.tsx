import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import Support from '@mui/icons-material/Support';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, redirect } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import { AppTitle } from './AppTitle';
import { Copyright } from './Copyright';
import { Link } from './Link';
import { ListItemButton } from './ListItemButton';
import { ListItemLink } from './ListItemLink';
import { Logo } from './Logo';
import { MainMenu } from './MainMenu';
import { Sidebar } from './Sidebar';

export default function MainLayout() {
    const { logout } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { compactView, setCompactView, themeMode, theme, switchThemeMode } = useAppContext();

    useEffect(() => {}, [locale, t]);

    const toggleDrawer = () => {
        setCompactView(!compactView);
    };

    function onLogout() {
        logout();
        redirect('/signin');
    }

    return (
        <Box
            sx={{
                display: 'flex',
                maxWidth: 'hd2',
                mx: 'auto',
            }}
        >
            <CssBaseline />

            <Sidebar variant="permanent" open={!compactView}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        px: [1],
                        bgcolor: (theme) => theme.palette.background.paper,
                    }}
                >
                    <Box
                        sx={{
                            display: 'block',
                            position: 'relative',
                        }}
                    >
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [0],
                            }}
                        >
                            <Logo onClick={toggleDrawer} />
                            {!compactView && (
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        ml: [2],
                                        mt: [2],
                                    }}
                                >
                                    <Link to="/welcome" color={'common.black'}>
                                        <AppTitle align="left" />
                                    </Link>
                                </Box>
                            )}
                        </Toolbar>

                        <MainMenu />
                    </Box>
                    <Box>
                        <List disablePadding component="nav" sx={{ mx: ['auto'], mb: [3] }}>
                            <ListItemLink
                                to="/profile"
                                primary={t('Profile')}
                                icon={<PersonOutlined />}
                            />

                            <ListItemButton
                                onClick={switchThemeMode}
                                primary={themeMode === 'light' ? t('Light theme') : t('Dark theme')}
                                icon={
                                    themeMode === 'light' ? (
                                        <DarkModeOutlined />
                                    ) : (
                                        <LightModeOutlined />
                                    )
                                }
                            />

                            <ListItemLink
                                target="_blank"
                                to="https://github.com/serhii-untilov/Payroll/discussions"
                                primary={t('Support')}
                                icon={<Support />}
                            />

                            <ListItemButton
                                onClick={onLogout}
                                primary={t('Logout')}
                                icon={<Logout />}
                            />
                        </List>
                        {!compactView && <Copyright sx={{ mx: ['auto'], mb: [3] }} />}
                    </Box>
                </Box>
            </Sidebar>

            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    flex: 1,

                    height: '100vh',
                    width: '100%',
                    overflow: 'auto',
                    p: [1],
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
