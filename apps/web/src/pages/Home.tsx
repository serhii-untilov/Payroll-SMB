import { Logout, PersonOutlined, Support } from '@mui/icons-material';
import { Link, List } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Outlet, redirect } from 'react-router-dom';
import { Copyright } from '../components/app/Copyright';
import { ListItemButton } from '../components/data/ListItemButton';
import { ListItemLink } from '../components/data/ListItemLink';
import { MainMenu } from '../components/layout/MainMenu';
import { Sidebar } from '../components/layout/Sidebar';
import useAuth from '../hooks/useAuth';
import { blue } from '@mui/material/colors';

export default function Home() {
    const { logout } = useAuth();
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    function onLogout() {
        logout();
        redirect('/signin');
    }

    function onHelp() {}

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
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
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
                                px: [1],
                            }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    height: 48,
                                    width: 48,
                                    mx: ['auto'],
                                    opacity: 0.55,
                                    '&:hover:not(.Mui-disabled)': {
                                        cursor: 'pointer',
                                    },
                                }}
                                alt="Application logo."
                                src="payroll.png"
                                onClick={toggleDrawer}
                            />
                            {open && (
                                <Typography
                                    component="h1"
                                    variant="h6"
                                    color="primary.main"
                                    noWrap
                                    sx={{ flexGrow: 1, ml: [2] }}
                                >
                                    {' Payroll SMB'}
                                </Typography>
                            )}
                        </Toolbar>

                        <MainMenu />
                    </Box>
                    <Box>
                        <List disablePadding component="nav" sx={{ mx: ['auto'], mb: [3] }}>
                            <ListItemLink
                                to="/profile"
                                primary="Profile"
                                icon={<PersonOutlined />}
                            />
                            {/* <ListItemLink to="/service" primary="Service" icon={<Layers />} /> */}
                            {/* <ListItemButton onClick={onHelp} primary="Help" icon={<Help />} /> */}
                            <ListItemLink
                                target="_blank"
                                to="https://github.com/serhii-untilov/Payroll/discussions"
                                primary="Support"
                                icon={<Support />}
                            />
                            <ListItemButton onClick={onLogout} primary="Logout" icon={<Logout />} />
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
                {/* <DataTable /> */}
                <Outlet />
            </Box>
        </Box>
    );
}
