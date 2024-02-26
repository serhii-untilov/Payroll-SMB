import { Logout, PersonOutlined, Support } from '@mui/icons-material';
import { List, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import { AppTitle } from './AppTitle';
import { Copyright } from './Copyright';
import { ListItemButton } from './ListItemButton';
import { ListItemLink } from './ListItemLink';
import { Logo } from './Logo';
import { MainMenu } from './MainMenu';
import { Sidebar } from './Sidebar';

export default function MainLayout() {
    const { logout } = useAuth();
    const [open, setOpen] = React.useState(true);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const matches = useMediaQuery('(min-width:900px)');

    useEffect(() => {}, [locale, t]);

    useEffect(() => {
        setOpen(matches);
    }, [matches]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    function onLogout() {
        logout();
        redirect('/signin');
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Sidebar variant="permanent" open={open}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        px: [1],
                        bgcolor: '#f7f7f7',
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
                            {open && (
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        ml: [2],
                                        mt: [2],
                                    }}
                                >
                                    <Link to="/home">
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
                            {/* <ListItemLink to="/service" primary="Service" icon={<Layers />} /> */}
                            {/* <ListItemButton onClick={onHelp} primary="Help" icon={<Help />} /> */}
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
                        {open && <Copyright sx={{ mx: ['auto'], mb: [3] }} />}
                    </Box>
                </Box>
            </Sidebar>

            <Box
                component="main"
                sx={{
                    bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                            ? 'background.paper'
                            : theme.palette.grey[100],
                    flexGrow: 1,
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
