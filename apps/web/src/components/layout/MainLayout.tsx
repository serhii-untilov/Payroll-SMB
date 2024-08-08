import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import { selectCompactView, setCompactView } from '@/store/slices/compactViewSlice';
import { selectThemeMode, switchThemeMode } from '@/store/slices/themeModeSlice';
import { store } from '@/store/store';
import { useAppDispatch } from '@/store/store.hooks';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import Support from '@mui/icons-material/Support';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppTitle } from '../AppTitle';
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
    const compactView = selectCompactView(store.getState());
    const themeMode = selectThemeMode(store.getState());
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {}, [locale, t]);

    const onSwitchThemeMode = useCallback(() => dispatch(switchThemeMode()), [dispatch]);

    const onToggleCompactView = useCallback(
        () => dispatch(setCompactView(!compactView)),
        [compactView, dispatch],
    );

    const onLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

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
                            <Logo onClick={onToggleCompactView} />
                            {!compactView && (
                                <Box sx={{ flexGrow: 1, ml: [2], my: 'auto' }}>
                                    <Link to="/welcome">
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
                                onClick={onSwitchThemeMode}
                                primary={themeMode === 'light' ? t('Light theme') : t('Dark theme')}
                                icon={
                                    themeMode === 'light' ? (
                                        <LightModeOutlined />
                                    ) : (
                                        <DarkModeOutlined />
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
