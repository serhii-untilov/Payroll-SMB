import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { MainMenu } from './MainMenu';
import { Copyright } from '../app/Copyright';
import { Sidebar } from './Sidebar';
import DataTable from '../data/DataTable';

export function MainLayout() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

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

                        <Divider />

                        <MainMenu />
                    </Box>
                    {open && <Copyright sx={{ mx: ['auto'], mb: [3] }} />}
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
