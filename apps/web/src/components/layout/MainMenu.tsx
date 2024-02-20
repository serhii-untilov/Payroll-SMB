import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button, Divider, List, ListItem } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps, useNavigate } from 'react-router-dom';
import { BusinessCenter, Description, People, Logout, Person } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

export function MainMenu() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function onLogout() {
        logout();
        navigate('/sign-in');
    }

    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemLink to="/company" primary="Company" icon={<BusinessCenter />} />
            <ListItemLink to="/employees" primary="Employees" icon={<People />} />
            <ListItemLink to="/payroll-sheet" primary="Payroll" icon={<Description />} />
        </List>
    );
}

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

export function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;

    return (
        <li>
            <ListItem button component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}

interface ListItemButtonProps {
    icon?: React.ReactElement;
    primary: string;
    onClick: React.MouseEventHandler;
}

export function ListItemButton(props: ListItemButtonProps) {
    const { icon, primary, onClick } = props;

    return (
        <li>
            <ListItem button component="button" onClick={onClick}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
