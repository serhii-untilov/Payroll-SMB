import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

const drawerWidth: number = 270;

export const Sidebar = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            border: 'none',
            // transition: theme.transitions.create('width', {
            //     easing: theme.transitions.easing.sharp,
            //     duration: theme.transitions.duration.enteringScreen,
            // }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                // transition: theme.transitions.create('width', {
                //     easing: theme.transitions.easing.sharp,
                //     duration: theme.transitions.duration.leavingScreen,
                // }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);
