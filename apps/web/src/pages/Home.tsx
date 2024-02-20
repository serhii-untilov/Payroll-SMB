import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ListItemButton, ListItemLink, MainMenu } from '../components/layout/MainMenu';
import { Copyright } from '../components/app/Copyright';
import { Sidebar } from '../components/layout/Sidebar';
import DataTable from '../components/data/DataTable';
import { Button, List } from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

export default function Home() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    function onLogout() {
        logout();
        navigate('/sign-in');
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
                                }}
                                alt="Application logo."
                                src="payroll.png"
                                onClick={toggleDrawer}
                            />
                            {open && (
                                <Typography
                                    component="h1"
                                    variant="h6"
                                    color="primary"
                                    noWrap
                                    sx={{ flexGrow: 1, ml: [2] }}
                                >
                                    {' Payroll SMB'}
                                </Typography>
                            )}
                        </Toolbar>

                        {/* <Divider /> */}

                        <MainMenu />
                    </Box>
                    <Box>
                        <List component="nav" sx={{ mx: ['auto'] }}>
                            <ListItemLink to="/profile" primary="Profile" icon={<Person />} />
                            <ListItemButton onClick={onLogout} primary="Logout" icon={<Logout />} />
                        </List>
                        {open && <Copyright sx={{ mx: ['auto'], mb: [3] }} />}
                    </Box>
                </Box>
            </Sidebar>

            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    width: '100%',
                    overflow: 'auto',
                    p: [1],
                }}
            >
                {/* <Workspace /> */}
                {/* <BasicTable /> */}
                <DataTable />
            </Box>
        </Box>
    );
}
